import Skeleton from 'react-loading-skeleton';

interface SpendingByTimeSkeletonProps {
  count?: number;
}

function SpendingByTimeSkeleton({ count = 6 }: SpendingByTimeSkeletonProps) {
  return (
    <section className="time-chart time-chart-skeleton" aria-label="Loading spending trends">
      <div className="time-chart-heading">
        <div>
          <Skeleton width={125} height={12} />
          <Skeleton width={175} height={28} />
        </div>
        <div className="time-chart-controls">
          {['Day', 'Month'].map((period) => (
            <Skeleton key={period} width={48} height={30} borderRadius={7} />
          ))}
        </div>
      </div>
      <div className="time-chart-bars">
        {Array.from({ length: count }, (_, index) => (
          <div className="time-chart-bar-group" key={index}>
            <Skeleton width={30} height={12} />
            <div className="time-chart-bar-track">
              <Skeleton className="time-chart-skeleton-bar" height={`${45 + (index % 3) * 20}%`} />
            </div>
            <Skeleton width={42} height={12} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default SpendingByTimeSkeleton;