const getCroppedImageBlob = (imageSrc: any, crop: any) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = crop.width;
      canvas.height = crop.height;

      context?.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
        } else {
          resolve(blob);
        }
      }, "image/jpg");
    };

    image.onerror = error => reject(error);
  });
};

export default getCroppedImageBlob;
