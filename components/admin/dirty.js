'use client';
// Salvestamata muudatuste lipp. Vorm tõstab lipu, kui admin midagi
// muudab, ja langetab pärast salvestamist või tühistamist. AdminApp
// hoiatab lipu järgi enne saki vahetust ja brauser enne lehelt
// lahkumist — nii ei kao pooleliolev töö kogemata klõpsuga.
let dirty = false;

export function markDirty() { dirty = true; }
export function clearDirty() { dirty = false; }
export function isDirty() { return dirty; }

export const DIRTY_MSG =
  'Sul on salvestamata muudatusi. Kas jätkad ilma salvestamata?';
