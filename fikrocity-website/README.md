# Fikrocity portfolio website

A responsive, static portfolio site for Fikrocity Software Solutions. The project archive currently lists phonecase254, Mytravelbuddy, mindarena, pantrysparky, and myoneweather. It is designed to grow as you add project details and visuals.

## Add projects

1. Put a project cover image inside `projects/` (a landscape image works best; JPG, PNG, and WebP are supported).
2. Open `projects.js` and add an object inside `window.FIKROCITY_PROJECTS`:

```js
{
  number: "01",
  title: "Project name",
  type: "Web platform",
  year: "2026",
  image: "projects/project-name.jpg",
  imageAlt: "Short description of the preview",
  url: "https://project.example", // optional
  description: "One sentence describing the project."
}
```

3. Save and refresh `index.html`. Add one object per project. The archive fills in automatically; cards open a project link when `url` is provided.

The site is static and does not have a server-side upload service. Adding work means placing the image and project details in the site folder, then redeploying it to your host. The contact inbox is set in `contact-config.js`. The 3D glass emblem can be rotated by dragging, with momentum and keyboard arrow controls; visitors can pause its gentle auto-rotation or reset it.

## Contact form

The contact form posts to FormSubmit in a hidden frame so visitors stay on the website. It sends an automatic acknowledgement to the email address submitted in the `email` field.

The inbox is set in `contact-config.js`. On first use, FormSubmit sends an activation email to the inbox. Confirm the activation link to begin receiving submissions. FormSubmit documents that autoresponses work with standard POST forms, but not AJAX submissions; the site uses a standard POST through the hidden frame to keep the page in place.

