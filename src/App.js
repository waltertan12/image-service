import React, { Component } from 'react';
import AvatarEditor from 'react-avatar-editor';
import './App.css';

class App extends Component {
  state = {
  }

  handleImage = files => {
    if (files.length) {
      this.setState({ image: files[0] })
    }
  }

  handleZoom = scale => {
    this.setState({ scale });
  }

  handleHeight = height => this.setState({ height: parseInt(height) })

  handleWidth = width => this.setState({ width: parseInt(width) })

  handleSave = data => {
    const img = this.editor.getImageScaledToCanvas().toDataURL()
    const rect = this.editor.getCroppingRect()

    console.log(img, rect);
  }

  setEditorRef = editor => {
    if (editor) {
      this.editor = editor
    }
  }

  render() {
    const { image, scale, height, width } = this.state;

    return (
      <div className="app">
        <AvatarEditor
          ref={this.setEditorRef}
          image={image || 'squirtle.jpg'}
          scale={scale}
          height={height}
          width={width}
        />
        <div>
          <label htmlFor="file">File</label><br />
          <input
            type="file"
            accept="image/*"
            onChange={e => this.handleImage(e.target.files)}
          />
          <br /><br />

          <label htmlFor="zoom">Zoom </label><br />
          <input
            type="range"
            onChange={e => this.handleZoom(e.target.value)}
            defaultValue={1}
            min={0}
            max={2}
            step={0.01}
          />
          <br /><br />

          <label htmlFor="height">Height</label><br />
          <input
            type="number"
            min={1}
            value={this.state.height}
            onChange={e => this.handleHeight(e.target.value)}
          />
          <br /><br />

          <label htmlFor="width">Width</label><br />
          <input
            type="number"
            min={1}
            value={this.state.width}
            onChange={e => this.handleWidth(e.target.value)}
          />
          <br /><br />
          <button onClick={e => this.handleSave(e)}>Preview</button>
        </div>
      </div>
    );
  }
}

export default App;
