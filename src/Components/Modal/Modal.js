import s from "../../styles.module.css";

import { useEffect } from "react";
import PropTypes from "prop-types";

export default function Modal({ handleModalToggle, image }) {
  useEffect(() => {
    window.addEventListener("keydown", onEscPress);

    return () => {
      window.removeEventListener("keydown", onEscPress);
    };
  });

  const onEscPress = (event) => {
    if (event.code === "Escape") {
      handleModalToggle("");
    }
  };

  return (
    <div
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleModalToggle("");
        }
      }}
      className={s.Overlay}
    >
      <div className={s.Modal}>
        <img src={image} alt="" />
      </div>
    </div>
  );
}

Modal.propTypes = {
  image: PropTypes.string.isRequired,
  handleModalToggle: PropTypes.func.isRequired,
};
