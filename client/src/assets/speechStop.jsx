import React from 'react';

function SpeechStop({ onClick, ...otherProps }) {
  return (
    <button type="button" onClick={onClick} {...otherProps}>
        <svg enable-background="new 0 0 24 24" focusable="false" height="24" viewBox="0 0 24 24" width="24" className=" NMm5M"><g><rect fill="none" height="24" width="24"></rect></g><g><g><path d="M6,6h12v12H6V6z"></path></g></g></svg>
    </button>
  );
}

export default SpeechStop;
