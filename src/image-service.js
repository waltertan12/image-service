const CONTENT_TYPE_REGEXP = /data:([a-z]+\/[a-z]+);base64,/;

export const base64ToBlob = (base64Data, sliceSize = 512) => {
  const regExpData = CONTENT_TYPE_REGEXP.exec(base64Data);
  if (regExpData === null) {
    throw new Error('Could not retreive content type from string');
  }

  const contentType = regExpData[1];
  const base64String = base64Data.replace(CONTENT_TYPE_REGEXP, '');
  const byteCharacters = atob(base64String);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: contentType });
};
