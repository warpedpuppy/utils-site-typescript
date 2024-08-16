function JSONCheckbox({
  t,
  bool,
  clickHandler,
  keyFunction,
}: {
  t: string;
  bool: boolean;
  clickHandler: Function;
  keyFunction: Function;
}) {
  return (
    <dd className="json-dd">
      <input
        type="checkbox"
        checked={bool}
        onChange={() => clickHandler(t, keyFunction)}
      />
      <div>{t}</div>
    </dd>
  );
}

export default JSONCheckbox;
