"use client";
import { useState } from "react";
import Button from "../reusable-components/Button";

export default function Generate() {
  const [story, setStory] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [storyConcept, setStoryConcept] = useState("");
  const [isGeneratePoster, setIsGeneratePoster] = useState(true);
  const [isGenerateStory, setIsGenerateStory] = useState(true);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [isLoadingPoster, setIsLoadingPoster] = useState(false);
  const [storyError, setStoryError] = useState("");
  const [posterError, setPosterError] = useState("");
  const [selectedScenes, setSelectedScenes] = useState<string[]>([]);
  const [sceneImages, setSceneImages] = useState<
    { scene: string; url: string }[]
  >([]);
  const [isGeneratingScenes, setIsGeneratingScenes] = useState(false);

  const onClear = () => {
    setStoryConcept("");
    setStory("");
    setPosterUrl("");
    setSelectedScenes([]);
    setSceneImages([]);
    setStoryError("");
    setPosterError("");
  };

  const onGenerate = async () => {
    setStoryError("");
    setPosterError("");

    if (isGenerateStory) {
      setIsLoadingStory(true);
      const storySuccess = await generateStory();
      setIsLoadingStory(false);
      if (!storySuccess) return;
    }

    if (isGeneratePoster) {
      setIsLoadingPoster(true);
      await generatePoster();
      setIsLoadingPoster(false);
    }
  };

  const generateStory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/generate/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: storyConcept }),
      });

      if (!response.ok) throw new Error("Story API Error");

      const data = await response.json();
      setStory(data.story);
      return true;
    } catch (error) {
      setStoryError("❌ Story generation failed. Please try again.");
      setStory("");
      return false;
    }
  };

  const generatePoster = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/generate/poster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story_summary: storyConcept }),
      });

      if (!response.ok) throw new Error("Poster API Error");

      const data = await response.json();
      setPosterUrl(data.poster_url || "");
    } catch (error) {
      setPosterError("❌ Poster generation failed. Please try again.");
      setPosterUrl("");
    }
  };

  const generateSceneImage = async (scene: string) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/generate/scene-image",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scene_description: scene }),
        }
      );

      if (!response.ok) throw new Error("Scene image generation failed");

      const data = await response.json();
      return data.scene_image_url;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const onGenerateSceneImages = async () => {
    setIsGeneratingScenes(true);
    const generatedImages = [];

    for (const scene of selectedScenes) {
      const imageUrl = await generateSceneImage(scene);
      if (imageUrl) {
        generatedImages.push({ scene, url: imageUrl });
      }
    }

    setSceneImages(generatedImages);
    setIsGeneratingScenes(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Left Panel */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Enter Your Story Concept</h2>
        <textarea
          value={storyConcept}
          onChange={(e) => setStoryConcept(e.target.value)}
          className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Type your story concept here..."
        ></textarea>

        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="generateStory"
            className="mr-2"
            checked={isGenerateStory}
            onChange={() => setIsGenerateStory(!isGenerateStory)}
          />
          <label htmlFor="generateStory" className="text-gray-700">
            Generate Story
          </label>
        </div>

        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="generatePoster"
            className="mr-2"
            checked={isGeneratePoster}
            onChange={() => setIsGeneratePoster(!isGeneratePoster)}
          />
          <label htmlFor="generatePoster" className="text-gray-700">
            Generate Poster
          </label>
        </div>

        <div className="mt-6 flex space-x-4">
          <Button onClick={onClear} className="bg-red-500 hover:bg-red-600">
            Clear
          </Button>
          <Button
            onClick={onGenerate}
            disabled={isLoadingStory || isLoadingPoster}
          >
            {isLoadingStory || isLoadingPoster ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-md">
        {posterUrl && (
          <img
            src={posterUrl}
            alt="Generated poster"
            className="w-full max-h-96 object-contain rounded-lg shadow-sm mb-4"
          />
        )}

        <h2 className="text-xl font-bold mb-4">Generated Story</h2>
        {story ? (
          story.split(". ").map((sentence, index) => (
            <p key={index} className="text-gray-700 mb-2">
              {sentence}.
              {sceneImages.find((img) => img.scene === sentence) && (
                <img
                  src={sceneImages.find((img) => img.scene === sentence)?.url}
                  alt="Scene illustration"
                  className="w-full max-h-80 object-contain rounded-lg my-4"
                />
              )}
            </p>
          ))
        ) : (
          <p className="text-gray-500">Your story will appear here.</p>
        )}

        {/* Scene Selection */}
        <h2 className="text-xl font-bold mt-6 mb-4">
          Select Scenes for Images
        </h2>
        {story &&
          story.split(". ").map((sentence, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                disabled={
                  selectedScenes.length >= 2 &&
                  !selectedScenes.includes(sentence)
                }
                checked={selectedScenes.includes(sentence)}
                onChange={() => {
                  setSelectedScenes((prev) =>
                    prev.includes(sentence)
                      ? prev.filter((s) => s !== sentence)
                      : [...prev, sentence]
                  );
                }}
              />
              <span>{sentence}.</span>
            </div>
          ))}

        <Button
          onClick={onGenerateSceneImages}
          disabled={isGeneratingScenes || selectedScenes.length === 0}
        >
          {isGeneratingScenes
            ? "Generating Images..."
            : "Generate Scene Images"}
        </Button>
      </div>
    </div>
  );
}
