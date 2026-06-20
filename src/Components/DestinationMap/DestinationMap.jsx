const DestinationMap = ({ latitude, longitude }) => {
  return (
    <iframe
      title="Destination Map"
      src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`}
      width="100%"
      height="300"
      style={{
        border: 0,
        borderRadius: "12px",
      }}
      loading="lazy"
      allowFullScreen
    />
  );
};

export default DestinationMap;