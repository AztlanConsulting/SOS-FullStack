# Plan: Replace ToggleSwitch with Select

## Summary

Replace local `ToggleSwitch` components with the shared `Select` component for 4 boolean fields (`esterilizado`, `collarPlaca`, `acostumbradoSalir`, `haEscapadoAntes`). Change types from `boolean` to `'' | 'Si' | 'No'` throughout the stack.

## Files to modify

### 1. `frontend/src/features/members-only/types/searchForm.types.ts`

**Type changes:**
```ts
// Before
esterilizado: boolean;
collarPlaca: boolean;
// After
esterilizado: '' | 'Si' | 'No';
collarPlaca: '' | 'Si' | 'No';
```

```ts
// Before
acostumbradoSalir: boolean;
haEscapadoAntes: boolean;
// After
acostumbradoSalir: '' | 'Si' | 'No';
haEscapadoAntes: '' | 'Si' | 'No';
```

**Initial values (same file):**
```ts
// Before
esterilizado: false,
collarPlaca: false,
acostumbradoSalir: false,
haEscapadoAntes: false,
// After
esterilizado: '',
collarPlaca: '',
acostumbradoSalir: '',
haEscapadoAntes: '',
```

---

### 2. `frontend/src/features/members-only/components/form/BasicPetInfoSection.tsx`

**Remove** the local `ToggleSwitch` definition (lines 12-49).

**Replace usage #1** (lines 132-138):
```tsx
{/* Before */}
<div id="esterilizado-section">
  <ToggleSwitch
    id="esterilizado-section"
    label="¿Está esterilizado?"
    checked={formData.esterilizado || false}
    onChange={(val) => updateForm({ esterilizado: val })}
  />
</div>

{/* After */}
<div id="esterilizado-section">
  <Select
    id="esterilizado-section"
    label="¿Está esterilizado?"
    value={formData.esterilizado}
    onChange={(e) =>
      updateForm({ esterilizado: e.target.value as SearchFormData['esterilizado'] })
    }
    options={[
      { value: 'Si', label: 'Sí' },
      { value: 'No', label: 'No' },
    ]}
  />
</div>
```

**Replace usage #2** (lines 141-147):
```tsx
{/* Before */}
<div id="collar-section">
  <ToggleSwitch
    id="collar-section"
    label="¿Tiene collar o placa identificadora?"
    checked={formData.collarPlaca || false}
    onChange={(val) => updateForm({ collarPlaca: val })}
  />
</div>

{/* After */}
<div id="collar-section">
  <Select
    id="collar-section"
    label="¿Tiene collar o placa identificadora?"
    value={formData.collarPlaca}
    onChange={(e) =>
      updateForm({ collarPlaca: e.target.value as SearchFormData['collarPlaca'] })
    }
    options={[
      { value: 'Si', label: 'Sí' },
      { value: 'No', label: 'No' },
    ]}
  />
</div>
```

> Note: `Select` is already imported at line 2. No import changes needed.

---

### 3. `frontend/src/features/members-only/components/form/BehaviorPersonalitySection.tsx`

**Remove** the local `ToggleSwitch` definition (lines 13-50).

**Replace usage #1** (lines 149-155):
```tsx
{/* Before */}
<div id="acostumbrado-salir">
  <ToggleSwitch
    id="acostumbrado-salir"
    label="¿Está acostumbrado a salir?"
    checked={formData.acostumbradoSalir || false}
    onChange={(val) => updateForm({ acostumbradoSalir: val })}
  />
</div>

{/* After */}
<div id="acostumbrado-salir">
  <Select
    id="acostumbrado-salir"
    label="¿Está acostumbrado a salir?"
    value={formData.acostumbradoSalir}
    onChange={(e) =>
      updateForm({ acostumbradoSalir: e.target.value as SearchFormData['acostumbradoSalir'] })
    }
    options={[
      { value: 'Si', label: 'Sí' },
      { value: 'No', label: 'No' },
    ]}
  />
</div>
```

**Replace usage #2** (lines 158-164):
```tsx
{/* Before */}
<div id="ha-escapado">
  <ToggleSwitch
    id="ha-escapado"
    label="¿Ha escapado antes?"
    checked={formData.haEscapadoAntes || false}
    onChange={(val) => updateForm({ haEscapadoAntes: val })}
  />
</div>

{/* After */}
<div id="ha-escapado">
  <Select
    id="ha-escapado"
    label="¿Ha escapado antes?"
    value={formData.haEscapadoAntes}
    onChange={(e) =>
      updateForm({ haEscapadoAntes: e.target.value as SearchFormData['haEscapadoAntes'] })
    }
    options={[
      { value: 'Si', label: 'Sí' },
      { value: 'No', label: 'No' },
    ]}
  />
</div>
```

> Note: `Select` is already imported at line 3. No import changes needed.

---

### 4. `frontend/src/features/members-only/hooks/useSearchForm.ts`

**Line 126** conditional:
```ts
// Before
if (formData.haEscapadoAntes && !formData.quePasoEscapado) {

// After
if (formData.haEscapadoAntes === 'Si' && !formData.quePasoEscapado) {
```

---

### 5. `backend/src/domain/models/searchForm.model.ts`

**Interface type changes:**
```ts
// Before
esterilizado: boolean;
collarPlaca: boolean;
acostumbradoSalir: boolean;
haEscapadoAntes: boolean;

// After
esterilizado: 'Si' | 'No';
collarPlaca: 'Si' | 'No';
acostumbradoSalir: 'Si' | 'No';
haEscapadoAntes: 'Si' | 'No';
```

**Schema changes:**
```ts
// Before
esterilizado: { type: Boolean, required: true },
collarPlaca: { type: Boolean, required: true },
acostumbradoSalir: { type: Boolean, required: true },
haEscapadoAntes: { type: Boolean, required: true },

// After
esterilizado: { type: String, required: true, enum: ['Si', 'No'] },
collarPlaca: { type: String, required: true, enum: ['Si', 'No'] },
acostumbradoSalir: { type: String, required: true, enum: ['Si', 'No'] },
haEscapadoAntes: { type: String, required: true, enum: ['Si', 'No'] },
```
