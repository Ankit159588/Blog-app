import ImageKit from "@imagekit/nodejs";
import config from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY
});

export const uploadImage = async (buffer, fileName) => {

  const result = await client.files.upload({
    file: buffer.toString("base64"),
    fileName: fileName
  });


  return result.url;
};
