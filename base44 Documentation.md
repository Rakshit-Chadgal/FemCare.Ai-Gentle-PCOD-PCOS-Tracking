# API Reference

**Base URL:** `https://femcare-cycle-sync.base44.app/api`

## Setup

```bash
npm install @base44/sdk
```

```javascript
import { createClient } from '@base44/sdk';

const base44 = createClient({
  appId: "6a547584a0e6c746a78f8067",
  headers: {
    "api_key": "b0f8c213e5204926abf15dfa96fd5a91"
  }
});
```

## LogTemplate

### Schema

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `template_name` | string | Yes |  |
| `cycle_started` | boolean |  |  |
| `cycle_ended` | boolean |  |  |
| `acne_severity` | number |  |  |
| `facial_hair_growth` | boolean |  |  |
| `hair_thinning` | boolean |  |  |
| `weight_change` | `up`, `down`, `same`, `unknown` |  |  |
| `mood` | number |  |  |
| `sleep_quality` | number |  |  |
| `pelvic_pain` | boolean |  |  |
| `pelvic_pain_severity` | number |  |  |
| `cravings_intensity` | number |  |  |
| `discomfort_areas` | array |  |  |
| `id` | string |  | Unique record identifier |
| `created_date` | string |  | Record creation timestamp |
| `updated_date` | string |  | Record last update timestamp |
| `created_by_id` | string |  | ID of the user who created the record |

### Endpoints

### `GET /entities/LogTemplate`
List LogTemplate records

**Parameters:**
- `q` (query): JSON query filter, e.g. {"status":"active"}
- `limit` (query): Maximum number of records to return
- `skip` (query): Number of records to skip (pagination)
- `sort_by` (query): Field name to sort by. Prefix with '-' for descending order, e.g. -created_date

```javascript
const records = await base44.entities.LogTemplate.list();
```

### `POST /entities/LogTemplate`
Create a LogTemplate record

```javascript
const record = await base44.entities.LogTemplate.create({
  // your data
});
```

### `DELETE /entities/LogTemplate`
Delete multiple LogTemplate records

```javascript
await base44.entities.LogTemplate.deleteMany({
  // query filter — WARNING: empty {} deletes ALL records
  template_name: "Example template_name"
});
```

### `POST /entities/LogTemplate/bulk`
Bulk create LogTemplate records

```javascript
const records = await base44.entities.LogTemplate.bulkCreate([
  { /* record 1 */ },
  { /* record 2 */ },
]);
```

### `PUT /entities/LogTemplate/bulk`
Bulk update LogTemplate records

```javascript
// bulk-update is not available via SDK — use the REST API
```

### `PATCH /entities/LogTemplate/update-many`
Update many LogTemplate records by query

```javascript
// update-many is not available via SDK — use the REST API
```

### `GET /entities/LogTemplate/{LogTemplate_id}`
Get a LogTemplate record by ID

**Parameters:**
- `LogTemplate_id` (path): Record ID

```javascript
const record = await base44.entities.LogTemplate.get(recordId);
```

### `PUT /entities/LogTemplate/{LogTemplate_id}`
Update a LogTemplate record

**Parameters:**
- `LogTemplate_id` (path): Record ID

```javascript
const record = await base44.entities.LogTemplate.update(recordId, {
  // fields to update
});
```

### `DELETE /entities/LogTemplate/{LogTemplate_id}`
Delete a LogTemplate record

**Parameters:**
- `LogTemplate_id` (path): Record ID

```javascript
await base44.entities.LogTemplate.delete(recordId);
```

### `PUT /entities/LogTemplate/{LogTemplate_id}/restore`
Restore a deleted LogTemplate record

**Parameters:**
- `LogTemplate_id` (path): Record ID

```javascript
const record = await base44.entities.LogTemplate.restore(recordId);
```

## Insight

### Schema

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `awareness_level` | `low`, `moderate`, `high` | Yes |  |
| `reasoning_summary` | string | Yes |  |
| `symptom_impacts` | array |  |  |
| `correlations` | array |  |  |
| `red_flags` | array |  |  |
| `doctor_nudge` | boolean |  |  |
| `doctor_nudge_reason` | string |  |  |
| `weekly_trend_summary` | string |  |  |
| `log_count_analyzed` | number |  |  |
| `date_range_start` | string |  |  |
| `date_range_end` | string |  |  |
| `id` | string |  | Unique record identifier |
| `created_date` | string |  | Record creation timestamp |
| `updated_date` | string |  | Record last update timestamp |
| `created_by_id` | string |  | ID of the user who created the record |

### Endpoints

### `GET /entities/Insight`
List Insight records

**Parameters:**
- `q` (query): JSON query filter, e.g. {"status":"active"}
- `limit` (query): Maximum number of records to return
- `skip` (query): Number of records to skip (pagination)
- `sort_by` (query): Field name to sort by. Prefix with '-' for descending order, e.g. -created_date

```javascript
const records = await base44.entities.Insight.list();
```

### `POST /entities/Insight`
Create a Insight record

```javascript
const record = await base44.entities.Insight.create({
  // your data
});
```

### `DELETE /entities/Insight`
Delete multiple Insight records

```javascript
await base44.entities.Insight.deleteMany({
  // query filter — WARNING: empty {} deletes ALL records
  awareness_level: "low"
});
```

### `POST /entities/Insight/bulk`
Bulk create Insight records

```javascript
const records = await base44.entities.Insight.bulkCreate([
  { /* record 1 */ },
  { /* record 2 */ },
]);
```

### `PUT /entities/Insight/bulk`
Bulk update Insight records

```javascript
// bulk-update is not available via SDK — use the REST API
```

### `PATCH /entities/Insight/update-many`
Update many Insight records by query

```javascript
// update-many is not available via SDK — use the REST API
```

### `GET /entities/Insight/{Insight_id}`
Get a Insight record by ID

**Parameters:**
- `Insight_id` (path): Record ID

```javascript
const record = await base44.entities.Insight.get(recordId);
```

### `PUT /entities/Insight/{Insight_id}`
Update a Insight record

**Parameters:**
- `Insight_id` (path): Record ID

```javascript
const record = await base44.entities.Insight.update(recordId, {
  // fields to update
});
```

### `DELETE /entities/Insight/{Insight_id}`
Delete a Insight record

**Parameters:**
- `Insight_id` (path): Record ID

```javascript
await base44.entities.Insight.delete(recordId);
```

### `PUT /entities/Insight/{Insight_id}/restore`
Restore a deleted Insight record

**Parameters:**
- `Insight_id` (path): Record ID

```javascript
const record = await base44.entities.Insight.restore(recordId);
```

## SymptomLog

### Schema

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `log_date` | string | Yes |  |
| `cycle_started` | boolean |  |  |
| `cycle_ended` | boolean |  |  |
| `acne_severity` | number |  |  |
| `facial_hair_growth` | boolean |  |  |
| `hair_thinning` | boolean |  |  |
| `weight_change` | `up`, `down`, `same`, `unknown` |  |  |
| `mood` | number |  |  |
| `sleep_quality` | number |  |  |
| `pelvic_pain` | boolean |  |  |
| `pelvic_pain_severity` | number |  |  |
| `cravings_intensity` | number |  |  |
| `discomfort_areas` | array |  |  |
| `notes` | string |  |  |
| `id` | string |  | Unique record identifier |
| `created_date` | string |  | Record creation timestamp |
| `updated_date` | string |  | Record last update timestamp |
| `created_by_id` | string |  | ID of the user who created the record |

### Endpoints

### `GET /entities/SymptomLog`
List SymptomLog records

**Parameters:**
- `q` (query): JSON query filter, e.g. {"status":"active"}
- `limit` (query): Maximum number of records to return
- `skip` (query): Number of records to skip (pagination)
- `sort_by` (query): Field name to sort by. Prefix with '-' for descending order, e.g. -created_date

```javascript
const records = await base44.entities.SymptomLog.list();
```

### `POST /entities/SymptomLog`
Create a SymptomLog record

```javascript
const record = await base44.entities.SymptomLog.create({
  // your data
});
```

### `DELETE /entities/SymptomLog`
Delete multiple SymptomLog records

```javascript
await base44.entities.SymptomLog.deleteMany({
  // query filter — WARNING: empty {} deletes ALL records
  log_date: "Example log_date"
});
```

### `POST /entities/SymptomLog/bulk`
Bulk create SymptomLog records

```javascript
const records = await base44.entities.SymptomLog.bulkCreate([
  { /* record 1 */ },
  { /* record 2 */ },
]);
```

### `PUT /entities/SymptomLog/bulk`
Bulk update SymptomLog records

```javascript
// bulk-update is not available via SDK — use the REST API
```

### `PATCH /entities/SymptomLog/update-many`
Update many SymptomLog records by query

```javascript
// update-many is not available via SDK — use the REST API
```

### `GET /entities/SymptomLog/{SymptomLog_id}`
Get a SymptomLog record by ID

**Parameters:**
- `SymptomLog_id` (path): Record ID

```javascript
const record = await base44.entities.SymptomLog.get(recordId);
```

### `PUT /entities/SymptomLog/{SymptomLog_id}`
Update a SymptomLog record

**Parameters:**
- `SymptomLog_id` (path): Record ID

```javascript
const record = await base44.entities.SymptomLog.update(recordId, {
  // fields to update
});
```

### `DELETE /entities/SymptomLog/{SymptomLog_id}`
Delete a SymptomLog record

**Parameters:**
- `SymptomLog_id` (path): Record ID

```javascript
await base44.entities.SymptomLog.delete(recordId);
```

### `PUT /entities/SymptomLog/{SymptomLog_id}/restore`
Restore a deleted SymptomLog record

**Parameters:**
- `SymptomLog_id` (path): Record ID

```javascript
const record = await base44.entities.SymptomLog.restore(recordId);
```

## UserProfile

### Schema

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `display_name` | string | Yes |  |
| `age` | number |  |  |
| `diagnosis_status` | `suspect`, `diagnosed`, `not_sure` |  |  |
| `cycle_regularity` | `regular`, `irregular`, `very_irregular`, `unknown` |  |  |
| `typical_cycle_length` | number |  |  |
| `has_ultrasound_finding` | boolean |  |  |
| `ultrasound_notes` | string |  |  |
| `disclaimer_acknowledged` | boolean |  |  |
| `onboarding_completed` | boolean |  |  |
| `id` | string |  | Unique record identifier |
| `created_date` | string |  | Record creation timestamp |
| `updated_date` | string |  | Record last update timestamp |
| `created_by_id` | string |  | ID of the user who created the record |

### Endpoints

### `GET /entities/UserProfile`
List UserProfile records

**Parameters:**
- `q` (query): JSON query filter, e.g. {"status":"active"}
- `limit` (query): Maximum number of records to return
- `skip` (query): Number of records to skip (pagination)
- `sort_by` (query): Field name to sort by. Prefix with '-' for descending order, e.g. -created_date

```javascript
const records = await base44.entities.UserProfile.list();
```

### `POST /entities/UserProfile`
Create a UserProfile record

```javascript
const record = await base44.entities.UserProfile.create({
  // your data
});
```

### `DELETE /entities/UserProfile`
Delete multiple UserProfile records

```javascript
await base44.entities.UserProfile.deleteMany({
  // query filter — WARNING: empty {} deletes ALL records
  display_name: "Example display_name"
});
```

### `POST /entities/UserProfile/bulk`
Bulk create UserProfile records

```javascript
const records = await base44.entities.UserProfile.bulkCreate([
  { /* record 1 */ },
  { /* record 2 */ },
]);
```

### `PUT /entities/UserProfile/bulk`
Bulk update UserProfile records

```javascript
// bulk-update is not available via SDK — use the REST API
```

### `PATCH /entities/UserProfile/update-many`
Update many UserProfile records by query

```javascript
// update-many is not available via SDK — use the REST API
```

### `GET /entities/UserProfile/{UserProfile_id}`
Get a UserProfile record by ID

**Parameters:**
- `UserProfile_id` (path): Record ID

```javascript
const record = await base44.entities.UserProfile.get(recordId);
```

### `PUT /entities/UserProfile/{UserProfile_id}`
Update a UserProfile record

**Parameters:**
- `UserProfile_id` (path): Record ID

```javascript
const record = await base44.entities.UserProfile.update(recordId, {
  // fields to update
});
```

### `DELETE /entities/UserProfile/{UserProfile_id}`
Delete a UserProfile record

**Parameters:**
- `UserProfile_id` (path): Record ID

```javascript
await base44.entities.UserProfile.delete(recordId);
```

### `PUT /entities/UserProfile/{UserProfile_id}/restore`
Restore a deleted UserProfile record

**Parameters:**
- `UserProfile_id` (path): Record ID

```javascript
const record = await base44.entities.UserProfile.restore(recordId);
```

## User

### Schema

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | string | Yes | The email of the user |
| `full_name` | string | Yes | The full name of the user |
| `role` | `admin`, `user` | Yes | The role of the user in the app |
| `id` | string |  | Unique record identifier |
| `created_date` | string |  | Record creation timestamp |
| `updated_date` | string |  | Record last update timestamp |
| `created_by_id` | string |  | ID of the user who created the record |

### Endpoints

### `GET /entities/User`
List User records

**Parameters:**
- `q` (query): JSON query filter, e.g. {"status":"active"}
- `limit` (query): Maximum number of records to return
- `skip` (query): Number of records to skip (pagination)
- `sort_by` (query): Field name to sort by. Prefix with '-' for descending order, e.g. -created_date

```javascript
const records = await base44.entities.User.list();
```

### `POST /entities/User`
Create a User record

```javascript
const record = await base44.entities.User.create({
  // your data
});
```

### `GET /entities/User/{User_id}`
Get a User record by ID

**Parameters:**
- `User_id` (path): Record ID

```javascript
const record = await base44.entities.User.get(recordId);
```

### `PUT /entities/User/{User_id}`
Update a User record

**Parameters:**
- `User_id` (path): Record ID

```javascript
const record = await base44.entities.User.update(recordId, {
  // fields to update
});
```

### `DELETE /entities/User/{User_id}`
Delete a User record

**Parameters:**
- `User_id` (path): Record ID

```javascript
await base44.entities.User.delete(recordId);
```
npm uninstall -g omniroute