export const getImages = (file: File, fn: (result: string) => void) => {
  var reader = new FileReader();
  reader.onload = function (e) {
    fn(e.target?.result as string);
  };
  reader.readAsDataURL(file);
};
