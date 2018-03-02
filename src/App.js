import { base64ToBlob } from './image-service'; import React, { Component } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { debounce } from 'lodash';
import './App.css';

const KILOBYTE = Math.pow(2, 10);
const MEGABYTE = Math.pow(2, 20);
const GIGABYTE = Math.pow(2, 30);
const toHumanReadableSize = bytes => {
  if (bytes === null) {
    return '';
  }

  if (bytes >= GIGABYTE) {
    return `${(bytes / GIGABYTE).toFixed(1)} gb`;
  }

  if (bytes >= MEGABYTE) {
    return `${(bytes / MEGABYTE).toFixed(1)} mb`;
  }

  if (bytes >= KILOBYTE) {
    return `${(bytes / KILOBYTE).toFixed(1)} kb`;
  }

  return `${bytes} bytes`;
};

class App extends Component {
  state = {
    imageUrl: null,
    creatingBlob: false,
    size: null,
    height: 480,
    width: 640,
    fixedAspectRatio: false,
  }

  handleImage = files => {
    if (files.length) {
      this.setState({ image: files[0] });
    }
  }

  handleZoom = scale => this.setState({ scale: parseFloat(scale, 0) });

  handleHeight = nextHeight => {
    nextHeight = parseInt(nextHeight, 0);

    const { fixedAspectRatio, height, width } = this.state;
    if (!fixedAspectRatio) {
      return this.setState({ height: nextHeight }); 
    }

    const aspectRatio = width / height;
    this.setState({
      height: nextHeight,
      width: (nextHeight * aspectRatio),
    });
  }

  handleWidth = nextWidth => {
    nextWidth = parseInt(nextWidth, 0);

    const { fixedAspectRatio, height, width } = this.state;
    if (!fixedAspectRatio) {
      return this.setState({ width: nextWidth });
    }

    const aspectRatio = width / height;
    this.setState({
      width: nextWidth,
      height: (nextWidth / aspectRatio),
    });
  }

  handleSave = data => {
    const base64Data = this.editor.getImageScaledToCanvas().toDataURL();
    const blob = base64ToBlob(base64Data);
    const imageUrl = URL.createObjectURL(blob);

    
    this.setState({ size: blob.size, imageUrl });
  }

  setEditorRef = editor => {
    if (editor) {
      this.editor = editor
    }
  }

  handleImageChange = () => {
    return debounce(() => {
      try {
        this.handleSave();
      } catch (e) {
        this.setState({ size: null, imageUrl: null });
      };
    }, 250);
  }

  handleFixedAspectRatio = () => {
    const { fixedAspectRatio } = this.state;

    this.setState({ fixedAspectRatio: !fixedAspectRatio });
   }

  render() {
    const {
      creatingBlob,
      size,
      image,
      scale,
      height,
      width,
      imageUrl,
      fixedAspectRatio,
    } = this.state;

    let download = null;
    if (imageUrl && !creatingBlob) {
      download = <a href={imageUrl} target="_blank">Download</a>;
    }

    return (
      <div className="app">
        <div className="editor">
          <div className="editor__image-editor">
            <AvatarEditor
              ref={this.setEditorRef}
              image={image || 'squirtle.jpg'}
              scale={scale}
              height={height}
              width={width}
              onImageChange={this.handleImageChange()}
            />
          </div>
          <div>
            <div className="editor__form-group">
              <label htmlFor="file">File</label>
              <br/>
              <input
                type="file"
                accept="image/*"
                onChange={e => this.handleImage(e.target.files)}
              />
            </div>

            <div className="editor__form-group">
              <label htmlFor="zoom">Zoom</label><br />
              <input
                type="range"
                onChange={e => this.handleZoom(e.target.value)}
                defaultValue={1}
                min={0.5}
                max={2}
                step={0.01}
              />
            </div>

            <div className="editor__form-group">
              <label htmlFor="dsp">DSP</label>
              <br />
                <input type="checkbox" value="google" />
                Google
              <br />
                <input type="checkbox" value="aol" />
                AOL 
              <br />
                <input type="checkbox" value="yahoo" />
                Yahoo 
            </div>

            <div className="editor__form-group">
              <label htmlFor="height">Fixed Aspect Ratio</label><br />
              <input
                type="checkbox"
                onClick={() => this.handleFixedAspectRatio()}
                checked={fixedAspectRatio}
              />
            </div>

            <div className="editor__form-group">
              <label htmlFor="height">Aspect Ratio</label><br />
              <input
                type="number"
                value={width / height}
                onChange={e => console.log(e.target.value)}
                disabled={!fixedAspectRatio}
              />
            </div>


            <div className="editor__form-group">
              <label htmlFor="height">Height</label><br />
              <input
                type="number"
                min={1}
                value={height}
                onChange={e => this.handleHeight(e.target.value)}
              />
            </div>


            <div className="editor__form-group">
            <label htmlFor="width">Width</label><br />
              <input
                type="number"
                min={1}
                value={width}
                onChange={e => this.handleWidth(e.target.value)}
              />
            </div>

            <div className="editor__form-group">
              <label htmlFor="width">File Size</label><br />
              <p>{toHumanReadableSize(size)}</p>
            </div>

            {download}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
