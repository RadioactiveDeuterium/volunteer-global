function TitleBar({ content }) {
  return (
    <div className="h-64 flex flex-col items-center justify-center bg-purple-200">
      <h3 className="text-5xl text-center">{content}</h3>
    </div>
  );
}

export default TitleBar;
