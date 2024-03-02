import React, { useState, useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ClipboardJS from 'clipboard';
import './style.scss'

const CopyButton = ({ text, onCopy }) => {
    const [svgContent, setSvgContent] = useState('');
    const svgRef = useRef(null);
  
    // const handleCopy = () => {
    //   const svgElement = svgRef.current;
    //   if (svgElement) {
    //     setSvgContent(svgElement.outerHTML);
    //   }
    // };
  
  const handleCopy = () => {
    const textToCopy = text || ''; // Use a default value if text is not provided
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log('Text copied to clipboard');
        onCopy(); // Call an optional callback function
      })
      .catch((err) => {
        console.error('Failed to copy text:', err);
      });
  };

  return (
    <CopyToClipboard text={text} onCopy={handleCopy}>
      <button className='copy-button' type="button">
        
        <svg width="24px" height="24px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.5 8.5H5.5V20.5H16.5V16.5M19.5 4.5H8.5V16.5H19.5V4.5Z" stroke="#121923" stroke-width="1.2"/>
</svg>
      </button>
     
    </CopyToClipboard>
  );
};

export default CopyButton;
