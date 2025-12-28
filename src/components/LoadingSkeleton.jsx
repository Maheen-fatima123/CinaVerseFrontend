import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
    const skeletonStyle = {
        background: 'linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '8px'
    };

    const renderCardSkeleton = () => (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="bg-dark rounded overflow-hidden" style={{ height: '400px' }}>
                <div style={{ ...skeletonStyle, height: '250px' }}></div>
                <div className="p-3">
                    <div style={{ ...skeletonStyle, height: '20px', marginBottom: '10px', width: '80%' }}></div>
                    <div style={{ ...skeletonStyle, height: '15px', marginBottom: '8px', width: '60%' }}></div>
                    <div style={{ ...skeletonStyle, height: '15px', width: '40%' }}></div>
                </div>
            </div>
        </div>
    );

    const renderListSkeleton = () => (
        <div className="mb-3 p-3 bg-dark rounded">
            <div style={{ ...skeletonStyle, height: '20px', marginBottom: '10px', width: '70%' }}></div>
            <div style={{ ...skeletonStyle, height: '15px', width: '90%' }}></div>
        </div>
    );

    const renderTextSkeleton = () => (
        <div style={{ ...skeletonStyle, height: '15px', marginBottom: '8px', width: '100%' }}></div>
    );

    const renderSkeleton = () => {
        switch (type) {
            case 'card':
                return renderCardSkeleton();
            case 'list':
                return renderListSkeleton();
            case 'text':
                return renderTextSkeleton();
            default:
                return renderCardSkeleton();
        }
    };

    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
            {Array.from({ length: count }).map((_, index) => (
                <React.Fragment key={index}>
                    {renderSkeleton()}
                </React.Fragment>
            ))}
        </>
    );
};

export default LoadingSkeleton;
