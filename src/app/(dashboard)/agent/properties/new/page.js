"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const INITIAL_FORM = {
  name: "",
  price: "",
  country: "NIGERIA",
  state: "",
  city: "",
  address: "",
  description: "",
  category: "FLAT",
  total_area: "",
  property_use: "RESIDENTIAL",
  payment_plan: "PER_ANNUM",
  type: "RENT",
  bedroom: 0,
  bathroom: 0,
  toilet: 0,
  parking_space: 0,
  furnishing: "UNFURNISHED",
  disclaimer: "",
  amenities: [],
  lat: 0,
  lng: 0,
};

export default function CreatePropertyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [amenityInput, setAmenityInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleAddAmenity = (e) => {
    e.preventDefault();
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim().toUpperCase())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim().toUpperCase()],
      }));
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      // API allows max 5 images
      const selectedFiles = Array.from(e.target.files).slice(0, 5);
      setImages(selectedFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.accessToken) {
      setError("Authentication error. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        price: formData.price.toString(), // API expects price as string
        agent: session.user.id // Pass the logged-in agent's ID
      };

      const res = await fetch("/api/v1/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      let data = {};
      if (res.headers.get("content-type")?.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok || data.type !== "SUCCESS") {
        setError(data.msg || "Failed to create property.");
        setLoading(false);
        return;
      }

      const propertyId = data.data?.id;

      // If images are selected, upload them now
      if (propertyId && images.length > 0) {
        const imageFormData = new FormData();
        images.forEach(img => {
          imageFormData.append("images", img);
        });

        const imgRes = await fetch(`/api/v1/properties/${propertyId}/resource`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: imageFormData,
        });
        
        if (!imgRes.ok) {
          console.warn("Images failed to upload, but property was created.");
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/agent/properties");
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-primary/10 text-primary p-6 text-center font-body-lg">
        Property created successfully. Redirecting to properties list...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="font-headline-lg text-headline-lg text-primary uppercase mb-8 hairline-b pb-4">
        CREATE NEW PROPERTY
      </h1>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 font-body-md text-sm mb-8">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-lowest p-6 hairline-all">
          <h2 className="col-span-full font-label-caps text-label-caps text-on-surface-variant uppercase border-b border-on-surface-variant/20 pb-2">Basic Information</h2>
          <Input label="Property Name" name="name" value={formData.name} onChange={handleChange} required />
          <Input label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required />
          <Input label="Description" name="description" value={formData.description} onChange={handleChange} required className="col-span-full" />
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-lowest p-6 hairline-all">
          <h2 className="col-span-full font-label-caps text-label-caps text-on-surface-variant uppercase border-b border-on-surface-variant/20 pb-2">Location</h2>
          <Input label="Country" name="country" value={formData.country} onChange={handleChange} required />
          <Input label="State" name="state" value={formData.state} onChange={handleChange} required />
          <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
          <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
        </div>

        {/* Classification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface-container-lowest p-6 hairline-all">
          <h2 className="col-span-full font-label-caps text-label-caps text-on-surface-variant uppercase border-b border-on-surface-variant/20 pb-2">Classification</h2>
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="bg-transparent border border-on-surface/20 p-3 font-body-md text-on-surface focus:border-primary focus:outline-none">
              <option value="RENT">Rent</option>
              <option value="LEASE">Lease</option>
              <option value="SALES">Sales</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="bg-transparent border border-on-surface/20 p-3 font-body-md text-on-surface focus:border-primary focus:outline-none">
              <option value="FLAT">Flat</option>
              <option value="APPARTMENT">Apartment</option>
              <option value="LAND">Land</option>
              <option value="DUPLEX">Duplex</option>
              <option value="WAREHOUSE">Warehouse</option>
              <option value="SHOP">Shop</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Property Use</label>
            <select name="property_use" value={formData.property_use} onChange={handleChange} className="bg-transparent border border-on-surface/20 p-3 font-body-md text-on-surface focus:border-primary focus:outline-none">
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Payment Plan</label>
            <select name="payment_plan" value={formData.payment_plan} onChange={handleChange} className="bg-transparent border border-on-surface/20 p-3 font-body-md text-on-surface focus:border-primary focus:outline-none">
              <option value="PER_ANNUM">Per Annum</option>
              <option value="MONTHLY">Monthly</option>
              <option value="PER_PLOT">Per Plot</option>
              <option value="PER_DAY">Per Day</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Furnishing</label>
            <select name="furnishing" value={formData.furnishing} onChange={handleChange} className="bg-transparent border border-on-surface/20 p-3 font-body-md text-on-surface focus:border-primary focus:outline-none">
              <option value="UNFURNISHED">Unfurnished</option>
              <option value="FURNISHED">Furnished</option>
            </select>
          </div>
          <Input label="Total Area (e.g. 200 sqm)" name="total_area" value={formData.total_area} onChange={handleChange} />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-surface-container-lowest p-6 hairline-all">
          <h2 className="col-span-full font-label-caps text-label-caps text-on-surface-variant uppercase border-b border-on-surface-variant/20 pb-2">Features</h2>
          <Input label="Bedrooms" name="bedroom" type="number" min="0" value={formData.bedroom} onChange={handleChange} />
          <Input label="Bathrooms" name="bathroom" type="number" min="0" value={formData.bathroom} onChange={handleChange} />
          <Input label="Toilets" name="toilet" type="number" min="0" value={formData.toilet} onChange={handleChange} />
          <Input label="Parking Spaces" name="parking_space" type="number" min="0" value={formData.parking_space} onChange={handleChange} />
        </div>

        {/* Amenities */}
        <div className="bg-surface-container-lowest p-6 hairline-all">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase border-b border-on-surface-variant/20 pb-2 mb-6">Amenities</h2>
          <div className="flex gap-4 mb-4">
            <input 
              type="text" 
              className="flex-1 bg-transparent border border-on-surface/20 p-3 font-body-md text-on-surface focus:border-primary focus:outline-none"
              placeholder="e.g. GYM, POOL, WIFI"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddAmenity(e); }}
            />
            <Button type="button" onClick={handleAddAmenity} className="bg-tertiary-fixed text-primary hover:bg-tertiary-fixed-dim">ADD</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.amenities.map(amenity => (
              <span key={amenity} className="bg-primary/10 text-primary px-3 py-1 font-label-caps text-xs flex items-center gap-2">
                {amenity}
                <button type="button" onClick={() => handleRemoveAmenity(amenity)} className="hover:text-error">×</button>
              </span>
            ))}
          </div>
        </div>

        <Input label="Disclaimer (Optional)" name="disclaimer" value={formData.disclaimer} onChange={handleChange} />

        {/* Images */}
        <div className="bg-surface-container-lowest p-6 hairline-all">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase border-b border-on-surface-variant/20 pb-2 mb-6">Images (Max 5)</h2>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleImageChange}
            className="w-full font-body-md text-on-surface file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-label-caps file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          {images.length > 0 && (
            <p className="mt-4 text-sm text-on-surface-variant">
              {images.length} {images.length === 1 ? 'image' : 'images'} selected.
            </p>
          )}
        </div>

        <Button type="submit" className="w-full bg-primary text-on-primary hover:bg-tertiary-fixed hover:text-primary transition-colors py-4 text-lg" disabled={loading}>
          {loading ? "CREATING PROPERTY..." : "CREATE PROPERTY"}
        </Button>
      </form>
    </div>
  );
}