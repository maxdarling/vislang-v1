import React, { useState, useRef, useEffect, useCallback } from "react";

export type EditableValueProps<T> = {
  /** Initial value (e.g. from node data). */
  initialValue: T;
  /** Called when the user changes the value. Use to sync to parent (e.g. updateNodeData). */
  onValueChange: (value: T) => void;
  /** Called once on mount with initialValue. Use to sync initial state to parent (e.g. when dropped from sidebar). */
  onInitialSync?: (value: T) => void;
  /** Parse user input string to value type (e.g. identity for string, parseInt for number). */
  parse: (input: string) => T;
  /** Format value for the input's value attribute. */
  format: (value: T) => string;
  /** Display text when value is empty or default (for the label when not editing). */
  defaultDisplay: string;
  inputClassName?: string;
  labelClassName?: string;
  inputAriaLabel?: string;
};

/**
 * A reactive value controlled by an input box.
 */
export function EditableValue<T>({
  initialValue,
  onValueChange,
  onInitialSync,
  parse,
  format,
  defaultDisplay,
  inputClassName,
  labelClassName,
  inputAriaLabel,
}: EditableValueProps<T>) {
  const [value, setValue] = useState<T>(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync initial value to parent on mount (e.g. when dropped from sidebar).
  useEffect(() => {
    onInitialSync?.(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const next = parse(evt.target.value);
      setValue(next);
      onValueChange(next);
    },
    [onValueChange, parse],
  );

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => setIsEditing(true);
  const handleBlur = () => setIsEditing(false);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setIsEditing(false);
  };

  const displayText = format(value).trim() ? format(value) : defaultDisplay;

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={format(value)}
      onChange={onChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`nodrag ${inputClassName ?? ""}`.trim()}
      aria-label={inputAriaLabel}
    />
  ) : (
    <div
      onClick={handleClick}
      className={`nodrag ${labelClassName ?? ""}`.trim()}
    >
      {displayText}
    </div>
  );
}
