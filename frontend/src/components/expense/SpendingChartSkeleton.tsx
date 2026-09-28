import Skeleton from "react-loading-skeleton";

interface SpendingChartSkeletonProps {
  count?: number;
}

const SpendingChartSkeleton = ({
  count = 6,
}: SpendingChartSkeletonProps) => {
  return (
    <div className="spending-chart-skeleton">
      {/* Header */}
      <div className="chart-skeleton-header">
        <div>
          <Skeleton width={150} height={12} />
          <Skeleton width={200} height={28} />
        </div>

        <Skeleton width={100} height={36} borderRadius={20} />
      </div>

      {/* Chart content */}
      <div className="chart-skeleton-content">

        {/* Doughnut */}
        <div className="donut-wrapper">
          <div className="donut-skeleton">
            <div className="donut-center">
              <Skeleton width={70} height={20} />
              <Skeleton width={40} height={12} />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="chart-skeleton-legend">
          {Array(count)
            .fill(null)
            .map((_, index) => (
              <div className="legend-skeleton-row" key={index}>
                <div className="legend-name">
                  <Skeleton width={12} height={12} />
                  <Skeleton width={75} height={16} />
                </div>

                <Skeleton width={30} height={16} />

                <Skeleton width={60} height={16} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingChartSkeleton;