// ============================================================================
// INTER SMJV 2026 — RegisterView
// ============================================================================

import React from 'react';
import RegistrationFlow from '../components/RegistrationFlow.jsx';
import { Icon, SportPictogram, BandhaniDivider } from '../components/common/UIComponents.jsx';

export default function RegisterView({ setPlayer, navigateTo, addToast, onOpenIdCard }) {
  return (
    <RegistrationFlow 
      setPlayer={setPlayer} 
      navigateTo={navigateTo} 
      addToast={addToast} 
      onOpenIdCard={onOpenIdCard}
    />
  );
}
