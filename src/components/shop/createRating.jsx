function RatingStars({ rating = 4 }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((star) => (
        <span
          key={star}
          className={
            star <= rating
              ? "text-yellow-400"
              : "text-gray-300"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default RatingStars;