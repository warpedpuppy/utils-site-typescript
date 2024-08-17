function JSONCheckbox({
  t,
  bool,
  clickHandler,
  keyFunction,
  className,
}: {
  t: string;
  bool: boolean;
  clickHandler: Function;
  keyFunction: Function;
  className: string;
}) {
  return (
    <dd className="json-dd">
      <input
        type="checkbox"
        checked={bool}
        onChange={() => clickHandler(t, keyFunction, className)}
      />
      <div>{t}</div>
    </dd>
  );
}

export default JSONCheckbox;
