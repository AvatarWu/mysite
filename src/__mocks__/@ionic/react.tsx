import React from 'react';

export const IonApp = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const IonPage = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const IonHeader = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const IonToolbar = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const IonTitle = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const IonContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const IonList = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const IonItem = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const IonLabel = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const IonButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => 
  <button onClick={onClick}>{children}</button>;
export const IonButtons = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const IonFab = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const IonFabButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => 
  <button onClick={onClick}>{children}</button>;
export const IonIcon = ({ icon }: { icon: string }) => <span>{icon}</span>;
export const IonToast = ({ isOpen, message }: { isOpen: boolean, onDidDismiss: () => void, message: string }) => 
  isOpen ? <div>{message}</div> : null;
export const IonBackButton = () => <button>Back</button>;
export const IonInput = ({ value, onIonChange }: { value?: string, onIonChange?: (e: any) => void }) => 
  <input value={value} onChange={onIonChange} />;
export const IonTextarea = ({ value, onIonChange }: { value?: string, onIonChange?: (e: any) => void }) => 
  <textarea value={value} onChange={onIonChange} />;
export const IonCheckbox = ({ checked, onIonChange }: { checked?: boolean, onIonChange?: (e: any) => void }) => 
  <input type="checkbox" checked={checked} onChange={onIonChange} />;
export const IonDatetime = ({ value, onIonChange }: { value?: string, onIonChange?: (e: any) => void }) => 
  <input type="datetime-local" value={value} onChange={onIonChange} />;
export const IonSelect = ({ value, onIonChange, children }: { value?: string, onIonChange?: (e: any) => void, children: React.ReactNode }) => 
  <select value={value} onChange={onIonChange}>{children}</select>;
export const IonSelectOption = ({ value, children }: { value: string, children: React.ReactNode }) => 
  <option value={value}>{children}</option>;
export const IonBadge = ({ children }: { children: React.ReactNode }) => <span>{children}</span>; 