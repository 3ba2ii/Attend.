import Slider from '@material-ui/core/Slider';
import AvatarOrInitials from 'components/Avatar/AvatarOrInitials';
import React, { useEffect } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { getFullName } from 'utlis/helpers/getFullName';
import './image-selector.css';

export default function ImageSelector({
  createdUserInfo,
  setCurrentImageState,
  defaultImage,
  includeUserInfo = true,
  imageClassName = 'select-picture-avatar',
}) {
  const [state, setState] = React.useState({
    cropperOpen: false,
    img: null,
    zoom: 2,
    rotate: 0,
    croppedImg: defaultImage || '',
  });

  const editorRef = React.useRef(null);
  const inputRef = React.useRef(null);

  function handleZoomSlider(event, value) {
    setState((prev) => ({ ...prev, zoom: value }));
  }

  function handleFileChange(e) {
    window.URL = window.URL || window.webkitURL;
    const url = window.URL.createObjectURL(e.target.files[0]);

    inputRef.current.value = '';
    setState((prev) => ({ ...prev, img: url, cropperOpen: true }));
  }

  function handleCancel() {
    setState((prev) => ({ ...prev, cropperOpen: false }));
  }

  function rotateLeft() {
    setState((prev) => ({ ...prev, rotate: (prev.rotate - 90) % 360 }));
  }

  function rotateRight() {
    setState((prev) => ({ ...prev, rotate: (prev.rotate + 90) % 360 }));
  }

  function handleSave(e) {
    if (editorRef.current) {
      const canvasScaled = editorRef.current.getImageScaledToCanvas();
      const croppedImg = canvasScaled.toDataURL();

      setState((prev) => ({ ...prev, cropperOpen: false, croppedImg }));
    }
  }

  useEffect(() => {
    setCurrentImageState(state);
  }, [state, setCurrentImageState]);
  return (
    <div className='image-selector-container'>
      <div className='select-image-avatar-container'>
        <label htmlFor='file-input' className='file-upload'>
          <AvatarOrInitials
            {...{
              url: state.croppedImg,
              name: createdUserInfo?.LecturerNameInEnglish,
              className: imageClassName,
              alt: 'avatar',
            }}
          />
        </label>

        <input
          id='file-input'
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='select-image-input-ref'
          ref={inputRef}
        />
        {includeUserInfo && (
          <div className='user-information select-image-user-info'>
            <span>
              {getFullName(createdUserInfo?.LecturerNameInEnglish) || ''}
            </span>
            <span>
              {createdUserInfo?.department?.DepartmentNameInEnglish +
                ' Department' || ''}
            </span>
            <p>{createdUserInfo?.role?.name || 'role'}</p>
          </div>
        )}
      </div>

      {state.cropperOpen && (
        <div className='cropper-wrapper'>
          <AvatarEditor
            ref={editorRef}
            image={state.img}
            width={200}
            height={200}
            border={50}
            color={[255, 255, 255, 0.6]} // RGBA
            rotate={state.rotate}
            scale={state.zoom}
          />
          <div className='image-edit-tools'>
            <div className='zoom-slider-container'>
              <label>Zoom</label>
              <Slider
                min={-1}
                max={10}
                step={0.1}
                value={state.zoom}
                onChange={handleZoomSlider}
                style={{ width: 200 }}
              />
            </div>
            <div className='zoom-slider-container'>
              <label>Rotate</label>

              <div className='rotation-buttons-container'>
                <button onClick={rotateLeft} className='icons8-rotate-left' />
                <button onClick={rotateRight} className='icons8-rotate-right' />
              </div>
            </div>
            <div className='save-btn-container'>
              <button onClick={handleCancel}>Cancel</button>
              <button
                onClick={handleSave}
                className='icons8-checkmark'
              ></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
