import { useState, useEffect } from "react";
import ImageGallery from "./Components/ImageGallery/ImageGallery";
import "./App.css";
import Searchbar from "./Components/Searchbar/Searchbar";
import Button from "./Components/Button/Button";
import Loader from "./Components/Loader/Loader";
import Modal from "./Components/Modal/Modal";
import Notiflix from "notiflix";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [pictures, setPictures] = useState([]);
  const [page, setPage] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState("");

  useEffect(() => {
    if (isPending) {
      fetch(
        `https://pixabay.com/api/?q=${inputValue}&page=${page}&key=24733344-a7c635fb3d48788b7b7d4e05e&image_type=photo&orientation=horizontal&per_page=12`
      )
        .then((response) => {
          if (response.ok) {

            return response.json();
          }
          return Promise.reject(new Error("no such pictures found"));
        })
        .then((pictures) => {

          if (pictures.totalHits === 0) {
            Notiflix.Notify.failure("no pictures found");
          }
          setPictures((prevState) =>
            page > 1 ? [...prevState, ...pictures.hits] : pictures.hits
          );

          setIsPending(false);
        })
        .catch((error) => {
          setError(error);
          setIsPending(false);
        });
    }
  },[inputValue, isPending, page]);

  function handleSetQuery(event) {
    setInputValue(event.target.value);
  }

  function onLoadMorePages() {
    setIsPending(true);
    setPage((prevState) => prevState + 1);
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    setIsPending(true);
    setPage(1);
    setPictures([]);
  }

  function handleModalToggle(image) {
    setIsModalOpen((prevState) => !prevState);
    setModalImg(image);
  }

  return (
    <div>
      {error && <h1>{error.message}</h1>}
      <Searchbar
        handleFormSubmit={handleFormSubmit}
        handleSetQuery={handleSetQuery}
        inputValue={inputValue}
      />

      {isPending && page === 1 ? (
        <Loader />
      ) : pictures.length > 0 ? (
        <ImageGallery
          pictures={pictures}
          handleModalToggle={handleModalToggle}
        />
      ) : null}

      {!(pictures.length > 0) ? null : !isPending ? (
        <Button onLoadMorePages={onLoadMorePages} />
      ) : (
        <Loader />
      )}
      {/* 
        {pictures.length >= 12 && <Button onLoadMorePages={onLoadMorePages.bind(this)} />} */}

      {isModalOpen && (
        <Modal handleModalToggle={handleModalToggle} image={modalImg} />
      )}
    </div>
  );
}
