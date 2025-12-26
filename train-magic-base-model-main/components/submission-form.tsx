"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SubmissionFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function SubmissionForm({ onSuccess, onCancel }: SubmissionFormProps) {
  const [formData, setFormData] = useState({
    modelName: "",
    description: "",
    modelFile: null as File | null,
    trainingHours: "",
    batchSize: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFormData((prev) => ({ ...prev, modelFile: file || null }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.modelName || !formData.modelFile || !formData.trainingHours || !formData.batchSize) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append("modelName", formData.modelName)
      fd.append("description", formData.description)
      fd.append("modelFile", formData.modelFile)
      fd.append("trainingHours", formData.trainingHours)
      fd.append("batchSize", formData.batchSize)

      const res = await fetch("/api/submissions", {
        method: "POST",
        body: fd,
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Submission failed")
        return
      }

      onSuccess()
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="modelName" className="text-foreground">
          Model Name *
        </Label>
        <Input
          id="modelName"
          name="modelName"
          placeholder="e.g., MAGIC-v1-optimized"
          value={formData.modelName}
          onChange={handleChange}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground">
          Description
        </Label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe your training approach and improvements"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="modelFile" className="text-foreground">
          Model File (.pt or .safetensors) *
        </Label>
        <Input
          id="modelFile"
          type="file"
          name="modelFile"
          accept=".pt,.safetensors"
          onChange={handleFileChange}
          className="bg-input border-border text-foreground file:bg-primary file:text-primary-foreground file:border-0 file:rounded file:cursor-pointer"
        />
        {formData.modelFile && <p className="text-sm text-muted-foreground">{formData.modelFile.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="trainingHours" className="text-foreground">
            Training Hours *
          </Label>
          <Input
            id="trainingHours"
            name="trainingHours"
            type="number"
            placeholder="24"
            value={formData.trainingHours}
            onChange={handleChange}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="batchSize" className="text-foreground">
            Batch Size *
          </Label>
          <Input
            id="batchSize"
            name="batchSize"
            type="number"
            placeholder="32"
            value={formData.batchSize}
            onChange={handleChange}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? "Uploading..." : "Submit Model"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1 border-border text-foreground hover:bg-secondary/20 bg-transparent"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
