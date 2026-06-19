import React from 'react';
import AppRoot from './src/AppRoot';
import { MobileWebFrame } from './src/web/MobileWebFrame';

export default function App() {
  return (
    <MobileWebFrame>
      <AppRoot />
    </MobileWebFrame>
  );
}
