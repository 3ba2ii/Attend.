import './buttons.css';
export const ButtonOnly = ({
  text,
  handleCLick,
  disabled,
  loadingIndicator,
}) => {
  return (
    <button className='btn-only btn' onClick={handleCLick} disabled={disabled}>
      <span>{text}</span>
    </button>
  );
};

export function ButtonWithIcon({
  disabled,
  loading,
  iconLoading,
  iconDefault,
  label,
}) {
  return (
    <button
      type='submit'
      className='btn-container-with-icon btn-shadow-radius btn'
      disabled={disabled}
    >
      {loading ? (
        <span>{iconLoading}</span>
      ) : (
        <span className='animated-top-onhover'>{iconDefault || null}</span>
      )}

      <span>{label}</span>
    </button>
  );
}
