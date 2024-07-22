// src/components/ImageUploadAndDisplay.js
import React, { useState } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { storage } from "../config/firebase";

const ImageUploadAndDisplay = () => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUrl(downloadURL);
            fetchImages();
          });
        }
      );
    }
  };

  const fetchImages = () => {
    const imagesRef = ref(storage, "images/");
    listAll(imagesRef)
      .then((result) => {
        const fetchPromises = result.items.map((imageRef) =>
          getDownloadURL(imageRef)
        );
        Promise.all(fetchPromises).then((urls) => setImages(urls));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div id="upload-file">
      <input
        type="file"
        className="custom-file-input"
        id="customFile"
        onChange={handleChange}
      />
      <button onClick={handleUpload}>Tải lên</button>
      <progress value={progress} max="100" />
      <br />
      {url && (
        <img
          src={url}
          alt="Uploaded"
          style={{ width: "200px", marginTop: "10px" }}
        />
      )}
      <div>
        <h2>Danh sách ảnh đã tải lên</h2>
        {images.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Uploaded ${index}`}
            style={{ width: "200px", margin: "10px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUploadAndDisplay;
