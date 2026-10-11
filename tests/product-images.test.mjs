import assert from "node:assert/strict";
import test from "node:test";
import { MAX_IMAGE_BYTES, parseProductImage, validateImageFile } from "../lib/product-images.ts";

const project = "https://koaflfdrucbawfplbmum.supabase.co";

test("upload validation rejects unsupported, empty and oversized files", () => {
  assert.equal(validateImageFile({ type: "image/jpeg", size: MAX_IMAGE_BYTES }), null);
  assert.match(validateImageFile({ type: "image/jpeg", size: MAX_IMAGE_BYTES + 1 }), /5 MB/);
  assert.match(validateImageFile({ type: "image/png", size: 0 }), /empty/);
  for (const type of ["image/svg+xml", "text/html", "", "constructor"]) {
    assert.match(validateImageFile({ type, size: 100 }), /JPG/);
  }
});

test("uploaded URLs retain their storage path; supported external links have none", () => {
  const url = `${project}/storage/v1/object/public/product-images/products/admin/photo.jpg`;
  assert.deepEqual(parseProductImage(url, project), {
    image_url: url, storage_path: "products/admin/photo.jpg",
  });
  assert.equal(parseProductImage("https://images.unsplash.com/photo-test?w=800", project).storage_path, null);
});

test("unsupported hosts, credentials, schemes and buckets are rejected before rendering", () => {
  for (const url of [
    "javascript:alert(1)", "data:image/png;base64,test", "not a url",
    "https://example.com/photo.jpg", "http://images.unsplash.com/photo.jpg",
    "https://user:pass@images.unsplash.com/photo.jpg",
    `${project}/storage/v1/object/public/private-documents/file.jpg`,
    `${project}/storage/v1/object/public/product-images/`,
    `${project}/storage/v1/object/public/product-images/products/%2E%2E%2Ffile.jpg`,
  ]) assert.throws(() => parseProductImage(url, project));
});
