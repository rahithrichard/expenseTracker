import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ExpenseTableSkeletonProps {
  count?: number;
}

const ExpenseTableSkeleton = ({
  count = 5,
}: ExpenseTableSkeletonProps) => {
  return (
    <div className="expense-table-skeleton">
      {/* Header */}
      <div className="table-skeleton-header">
        <div>
          <Skeleton width={130} height={12} />
          <Skeleton width={180} height={28} />
        </div>

        <Skeleton width={80} height={36} borderRadius={20} />
      </div>

      {/* Filters */}
      <div className="table-skeleton-filters">
        <div>
          <Skeleton width={45} height={12} />
          <Skeleton width={205} height={48} borderRadius={8} />
        </div>

        <div>
          <Skeleton width={65} height={12} />
          <Skeleton width={155} height={48} borderRadius={8} />
        </div>

        <div>
          <Skeleton width={35} height={12} />
          <Skeleton width={155} height={48} borderRadius={8} />
        </div>

        <Skeleton width={115} height={48} borderRadius={8} />
      </div>

      {/* Table heading */}
      <div className="table-skeleton-columns">
        <Skeleton width={60} height={12} />
        <Skeleton width={70} height={12} />
        <Skeleton width={70} height={12} />
        <Skeleton width={50} height={12} />
        <Skeleton width={65} height={12} />
      </div>

      {/* Rows */}
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <div className="table-skeleton-row" key={index}>
            <Skeleton width="70%" height={16} />

            <Skeleton width={65} height={16} />

            <Skeleton width={70} height={16} />

            <Skeleton width={85} height={16} />

            <div className="table-skeleton-actions">
              <Skeleton width={35} height={16} />
              <Skeleton width={45} height={16} />
            </div>
          </div>
        ))}

      {/* Pagination */}
      <div className="table-skeleton-pagination">
        <Skeleton width={80} height={16} />
        <div>
          <Skeleton width={80} height={40} borderRadius={8} />
          <Skeleton width={60} height={40} borderRadius={8} />
        </div>
      </div>
    </div>
  );
};

export default ExpenseTableSkeleton;