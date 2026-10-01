# API Specification & Reference — KnowAboutMe

All API endpoints reside under `/api` and return standard JSON responses:
```json
{
  "success": true,
  "data": { ... }
}
```
Errors return:
```json
{
  "success": false,
  "error": "Error description"
}
```

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Creates a new account and initializes a published profile.
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "username": "uniquehandle",
    "displayName": "User Name"
  }
  ```
- **Response**: Sets `knowaboutme_session` cookie and returns user object.

### `POST /api/auth/login`
Authenticates an existing user.
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Response**: Sets `knowaboutme_session` cookie and returns user object.

### `POST /api/auth/logout`
Clears the session cookie.

### `GET /api/auth/me`
Returns current session info.

---

## 2. Profile Management

### `GET /api/profile`
Fetches the active user's profile and settings. Requires authentication.

### `PATCH /api/profile`
Updates profile information, theme selection, or typography.
- **Body**:
  ```json
  {
    "display_name": "Updated Name",
    "headline": "Product Designer & Builder",
    "short_bio": "Elevator pitch...",
    "long_bio": "Detailed story...",
    "profile_photo_url": "https://...",
    "cover_image_url": "https://...",
    "theme_id": "creative",
    "accent_color": "#6366f1",
    "font_family": "sans",
    "availability_status": "Open to opportunities"
  }
  ```

---

## 3. Social Links Management

### `GET /api/social-links`
Returns list of configured social links for the authenticated user.

### `POST /api/social-links`
Adds a new social link.
- **Body**:
  ```json
  {
    "platform": "github",
    "label": "GitHub",
    "username": "alex",
    "url": "https://github.com/alex"
  }
  ```

### `DELETE /api/social-links/[id]`
Deletes a link by ID.

---

## 4. Portfolio Sections Management

### `GET /api/sections?type={experience|education|skills|projects|artwork|hobbies|interests|achievements|testimonials|timeline}`
Returns array of items belonging to the selected section type.

### `POST /api/sections`
Adds an entry to a section.
- **Body**:
  ```json
  {
    "sectionType": "experience",
    "data": {
      "company_name": "Acme Corp",
      "position": "Staff Engineer",
      "start_date": "2023-01-01",
      "is_current": true,
      "description": "Led core architecture."
    }
  }
  ```

### `DELETE /api/sections/[id]?type={sectionType}`
Permanently deletes an individual section entry.

---

## 5. Contact & Messages

### `POST /api/contact` (Public)
Delivers a visitor message to the profile owner's inbox without revealing private emails.
- **Body**:
  ```json
  {
    "profileId": "uuid-here",
    "name": "Visitor Name",
    "email": "visitor@example.com",
    "subject": "Collaboration Inquiry",
    "message": "Hello, I would love to discuss a project..."
  }
  ```

### `GET /api/messages`
Retrieves messages received by the authenticated profile owner.

### `PATCH /api/messages`
Updates status (`read`, `archived`, `new`).
- **Body**:
  ```json
  {
    "id": "message-uuid",
    "status": "read"
  }
  ```

### `DELETE /api/messages?id={message-uuid}`
Deletes a message.

---

## 6. Privacy & Settings

### `GET /api/settings`
Returns visibility and privacy toggles.

### `PATCH /api/settings`
Updates privacy flags, profile status (`published`, `draft`, `private`), or changes account password.

---

## 7. Platform Administration (Admin Role Required)

### `GET /api/admin/users`
Lists all registered users with profile metadata, status, and verification state.

### `PATCH /api/admin/users`
- **Body**:
  ```json
  {
    "userId": "user-uuid",
    "is_verified": true,
    "status": "active"
  }
  ```

### `GET /api/admin/stats`
Returns system KPIs (total accounts, published profiles, verified identities, aggregate views).
