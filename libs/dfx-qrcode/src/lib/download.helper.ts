export function downloadQRCode(dataURL: string, type: 'png' | 'svg', filename = 'qrcode') {
  // split into two parts
  const parts = dataURL.split(';base64,');
  // hold the content type
  const imageType = parts[0].split(':')[1];
  // decode base64 string
  const decodedData = atob(parts[1]);
  // create unit8array of size same as row data length
  const uInt8Array = new Uint8Array(decodedData.length);
  // insert all character code into uint8array
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }
  // return blob image after conversion
  const blobData = new Blob([uInt8Array], { type: imageType });

  // saves as image
  const blob = new Blob([blobData], { type: `image/${type === 'png' ? 'png' : 'svg+xml'}` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
}
