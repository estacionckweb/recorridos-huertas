import React, { useState, useRef, useEffect } from 'react'

const ImageMason = ({ src, alt, srcOri }) => {
    const [expanded, setExpanded] = useState(false);
    const imageRef = useRef(null);
    const expandedImageRef = useRef(null);

    function handleClick() {
        setExpanded(true);
    }

    function handleClose() {
        // setExpanded(false);
        // get screen position of imageRef
        const rect = imageRef.current.getBoundingClientRect();
        // get screen position of window
        const windowRect = document.body.getBoundingClientRect();
        // get the position of the image relative to the window
        const top = rect.top - windowRect.top;
        const left = rect.left - windowRect.left;
        // set the position of the expanded image
        expandedImageRef.current.style.top = `${top + rect.height / 2}px`;
        expandedImageRef.current.style.left = `${left + rect.width / 2}px`;
        // set the size of the expanded image
        expandedImageRef.current.style.width = `${rect.width}px`;
        expandedImageRef.current.style.height = `${rect.height}px`;

        setTimeout(() => {
            setExpanded(false);
        }, 200);
    }

    useEffect(() => {
        if (expanded) {
            // get screen position of imageRef
            const rect = imageRef.current.getBoundingClientRect();
            // get screen position of window
            const windowRect = document.body.getBoundingClientRect();
            // get the position of the image relative to the window
            const top = rect.top - windowRect.top;
            const left = rect.left - windowRect.left;
            // set the position of the expanded image
            expandedImageRef.current.style.top = `${top + rect.height / 2}px`;
            expandedImageRef.current.style.left = `${left + rect.width / 2}px`;
            // set the size of the expanded image
            expandedImageRef.current.style.width = `${rect.width}px`;
            expandedImageRef.current.style.height = `${rect.height}px`;

            // animate the expanded image
            setTimeout(() => {
                expandedImageRef.current.style.transition = 'all .2s ease';
                expandedImageRef.current.style.top = '50%';
                expandedImageRef.current.style.left = '50%';
                expandedImageRef.current.style.width = '100%';
                expandedImageRef.current.style.height = '100%';
            }, 50);
        }

    }, [expanded])

    return (
        <div className="image-container">
            {expanded ? (
                <>
                    <div ref={expandedImageRef} className="expanded-image"
                        style={{
                            backgroundImage: `url(${srcOri})`,
                        }}
                        onClick={handleClose}
                    ></div>
                </>
            ) : (
                <>

                </>
            )}
            <img ref={imageRef} src={src} alt={alt} onClick={handleClick} />

        </div>
    );
}

export default ImageMason