"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

type SelectOption<Value extends string> = {
  value: Value;
  label: string;
  disabled?: boolean;
};

type AnimatedSelectProps<Value extends string> = {
  id?: string;
  name?: string;
  ariaLabel?: string;
  value: Value;
  onValueChange: (value: Value) => void;
  options: readonly SelectOption<Value>[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
};

export function AnimatedSelect<Value extends string>({
  id,
  name,
  ariaLabel,
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  disabled,
  required,
}: AnimatedSelectProps<Value>) {
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return <Select.Root value={value} onValueChange={(next) => onValueChange(next as Value)} name={name} disabled={disabled} required={required}>
    <Select.Trigger id={id} aria-label={ariaLabel} className="select-trigger">
      <Select.Value placeholder={placeholder}>{selectedLabel}</Select.Value>
      <Select.Icon asChild><ChevronDown className="select-chevron" size={16} aria-hidden="true" /></Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="select-content" position="popper" sideOffset={8} collisionPadding={12}>
        <Select.ScrollUpButton className="select-scroll-button"><ChevronUp size={15} aria-hidden="true" /></Select.ScrollUpButton>
        <Select.Viewport className="select-viewport">
          {options.map((option) => <Select.Item key={option.value} value={option.value} disabled={option.disabled} textValue={option.label} className="select-option">
            <Select.ItemText>{option.label}</Select.ItemText>
            <Select.ItemIndicator className="select-indicator"><Check size={15} aria-hidden="true" /></Select.ItemIndicator>
          </Select.Item>)}
        </Select.Viewport>
        <Select.ScrollDownButton className="select-scroll-button"><ChevronDown size={15} aria-hidden="true" /></Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>;
}