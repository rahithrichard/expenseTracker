import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function SkeletonComponent({ count}: { count?: number }) {
    return (
      
            <div className="skeleton-container">
            { Array(count).fill(0).map((_,i) =>
                <div key={i} className="skeleton-card">
                    <div className="icon-img">
                        <Skeleton circle width={40} height={40} />
                    </div>
                    <div className="content-st">
                        <Skeleton count={2} />
                    </div>     
                </div>
            )}
        </div>
    );
}

export default SkeletonComponent;
