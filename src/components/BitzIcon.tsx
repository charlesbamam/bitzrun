import React from 'react';
import { LucideIcon } from 'lucide-react-native';

export type BitzIconProps = {
  icon: LucideIcon;
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
  style?: any;
};

export function BitzIcon({
  icon: Icon,
  size = 24,
  color = '#F8FAFC',
  fill,
  strokeWidth = 2.3,
  style,
}: BitzIconProps) {
  return (
    <Icon
      size={size}
      color={color}
      fill={fill}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    />
  );
}
