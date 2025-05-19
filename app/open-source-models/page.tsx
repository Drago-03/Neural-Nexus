"use client";

import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, Database, Code, BookOpen } from "lucide-react";

export default function OpenSourceModelsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <section className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Open Source AI Playground</h1>
            <p className="text-xl text-gray-300 mb-10">
              Unlock the AI multiverse with these no-cap free models and resources. Build your next viral project without dropping a bag. 
              No gatekeeping here — just straight fire tools anyone can use.
            </p>
          </motion.div>

          <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-pink-500/30 mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-3xl mr-2">🔥</span> 
              <span className="bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">Trending This Week</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div className="bg-black/30 p-4 rounded-lg border border-pink-500/20 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">Mixtral 8x7B</h3>
                  <span className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-full">Trending #1</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">Mixtral's sparse mixture of experts model that's eating other LLMs for breakfast. Unreal performance for its size.</p>
                <div className="mt-auto flex items-center">
                  <span className="text-pink-400 text-xs mr-3">38k+ downloads</span>
                  <Link href="https://huggingface.co/mistralai/Mixtral-8x7B-v0.1" className="text-blue-400 hover:text-blue-300 text-sm ml-auto">
                    Check it →
                  </Link>
                </div>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg border border-pink-500/20 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">SDXL Turbo</h3>
                  <span className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-full">Trending #2</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">Real-time Stable Diffusion that generates images in a single step. This thing is straight-up magic.</p>
                <div className="mt-auto flex items-center">
                  <span className="text-pink-400 text-xs mr-3">26k+ downloads</span>
                  <Link href="https://huggingface.co/stabilityai/sdxl-turbo" className="text-blue-400 hover:text-blue-300 text-sm ml-auto">
                    Check it →
                  </Link>
                </div>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg border border-pink-500/20 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">CodeLlama 13B</h3>
                  <span className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-full">Trending #3</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">Meta's code generation model that's leveling up devs everywhere. It writes code so clean you'll think it's human.</p>
                <div className="mt-auto flex items-center">
                  <span className="text-pink-400 text-xs mr-3">19k+ downloads</span>
                  <Link href="https://huggingface.co/codellama/CodeLlama-13b-hf" className="text-blue-400 hover:text-blue-300 text-sm ml-auto">
                    Check it →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-3xl mr-2">🤖</span> 
              <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">AI Models That Slap</span>
            </h2>
            <p className="text-gray-300 mb-6">
              These models are giving main character energy fr. All free to use, no strings attached. 
              Just grab 'em from Hugging Face and cook up something that'll make the TL go wild.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">BERT (Bidirectional Encoder Representations from Transformers)</h3>
                <p className="text-gray-300">Perfect for text classification, question answering, and more. Pre-trained on massive datasets for ultimate accuracy.</p>
                <Link href="https://huggingface.co/bert-base-uncased" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">GPT-2 (Generative Pre-trained Transformer 2)</h3>
                <p className="text-gray-300">Generate human-like text with this OG model. Great for chatbots and creative writing tools.</p>
                <Link href="https://huggingface.co/gpt2" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">T5 (Text-To-Text Transfer Transformer)</h3>
                <p className="text-gray-300">A versatile model for summarization, translation, and text generation. One model, many tasks!</p>
                <Link href="https://huggingface.co/t5-base" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">DistilBERT</h3>
                <p className="text-gray-300">A lighter, faster version of BERT with 97% of its performance but half the size. Speedy vibes!</p>
                <Link href="https://huggingface.co/distilbert-base-uncased" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">RoBERTa (Robustly Optimized BERT)</h3>
                <p className="text-gray-300">An upgraded BERT with better training techniques for top-tier results on NLP tasks.</p>
                <Link href="https://huggingface.co/roberta-base" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">CLIP (Contrastive Language-Image Pretraining)</h3>
                <p className="text-gray-300">Connects text and images for tasks like image classification and captioning. Vision + language = 🔥</p>
                <Link href="https://huggingface.co/openai/clip-vit-base-patch32" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Llama 2</h3>
                <p className="text-gray-300">Meta's open-source large language model with 7B to 70B parameters. Vibing for chat and general text generation.</p>
                <Link href="https://huggingface.co/meta-llama" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Mistral 7B</h3>
                <p className="text-gray-300">High-quality, lightweight model that outperforms larger models through superior architecture. Giving major efficiency.</p>
                <Link href="https://huggingface.co/mistralai/Mistral-7B-v0.1" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Stable Diffusion XL</h3>
                <p className="text-gray-300">Next-gen image generation model from Stability AI. Text-to-image with unreal detail and style customization.</p>
                <Link href="https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Whisper</h3>
                <p className="text-gray-300">OpenAI's speech recognition model with multilingual capabilities. Low-key amazing for transcription and translation.</p>
                <Link href="https://huggingface.co/openai/whisper-large-v2" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">DINO (Vision Transformer)</h3>
                <p className="text-gray-300">Self-supervised vision transformer that learns visual features without labels. Cracked for image understanding tasks.</p>
                <Link href="https://huggingface.co/facebook/dino-vitb16" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">AudioLDM</h3>
                <p className="text-gray-300">Text-to-audio generation model. Drop a prompt, get back fire audio that matches your vibe description.</p>
                <Link href="https://huggingface.co/cvssp/audioldm" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>
            </div>

            <div className="text-center mt-6">
              <Link href="https://huggingface.co/models" className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all inline-block">
                Explore More Models on Hugging Face
              </Link>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-3xl mr-2">📊</span>
              <span className="bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">Data That Hits Different</span>
            </h2>
            <p className="text-gray-300 mb-6">
              Training data is the real MVP. These datasets are lowkey stacked and ready to level up your AI projects.
              Zero cost but maximum value - we love to see it.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Wikipedia Dataset</h3>
                <p className="text-gray-300">A massive collection of Wikipedia articles for NLP tasks. Great for pre-training language models.</p>
                <Link href="https://huggingface.co/datasets/wikipedia" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Get the Data <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">COCO (Common Objects in Context)</h3>
                <p className="text-gray-300">A dataset for image captioning and object detection with over 330K images.</p>
                <Link href="https://cocodataset.org/" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Get the Data <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">IMDB Reviews</h3>
                <p className="text-gray-300">Sentiment analysis dataset with 50K movie reviews labeled as positive or negative.</p>
                <Link href="https://huggingface.co/datasets/imdb" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Get the Data <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">LibriSpeech</h3>
                <p className="text-gray-300">A dataset of 1,000 hours of English speech for speech recognition models.</p>
                <Link href="https://huggingface.co/datasets/librispeech_asr" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Get the Data <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">SQuAD (Stanford Question Answering Dataset)</h3>
                <p className="text-gray-300">Over 100K question-answer pairs for reading comprehension models.</p>
                <Link href="https://huggingface.co/datasets/squad" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Get the Data <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Open Images Dataset</h3>
                <p className="text-gray-300">9 million images with labels for object detection and segmentation.</p>
                <Link href="https://storage.googleapis.com/openimages/web/index.html" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Get the Data <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Common Crawl</h3>
                <p className="text-gray-300">Massive web crawl data used to train many LLMs. Petabytes of text data from the internet - absolute unit for training.</p>
                <Link href="https://commoncrawl.org/" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Access <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">The Pile</h3>
                <p className="text-gray-300">825GB diverse English text corpus designed specifically for training large language models. It's stacked.</p>
                <Link href="https://pile.eleuther.ai/" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Access <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">LAION-5B</h3>
                <p className="text-gray-300">5 billion image-text pairs for training multimodal models. The GOAT dataset for text-to-image models like Stable Diffusion.</p>
                <Link href="https://laion.ai/blog/laion-5b/" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Access <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">HuggingFace Datasets</h3>
                <p className="text-gray-300">Library with 30k+ datasets ready to use. One-liner to load popular datasets - literally no cap, easiest way to get training data.</p>
                <Link href="https://huggingface.co/datasets" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Access <span className="ml-1">→</span>
                </Link>
              </div>
            </div>

            <div className="text-center mt-6">
              <Link href="https://huggingface.co/datasets" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg transition-all inline-block">
                Explore More Datasets
              </Link>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-3xl mr-2">⚙️</span>
              <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Tools To Level Up Your AI Game</span>
            </h2>
            <p className="text-gray-300 mb-6">
              The tools you need to go from zero to AI hero without the struggle. 
              These libraries and scripts are bussin' - no cap. Your workflow just got a glow up.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Transformers Library by Hugging Face</h3>
                <p className="text-gray-300">The ultimate toolkit for working with pre-trained models. Fine-tune, train, and deploy with ease.</p>
                <Link href="https://github.com/huggingface/transformers" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Grab the Code <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">PyTorch Training Scripts</h3>
                <p className="text-gray-300">Official PyTorch scripts for training models on various tasks. Clean and customizable.</p>
                <Link href="https://github.com/pytorch/examples" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Grab the Code <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">TensorFlow Model Garden</h3>
                <p className="text-gray-300">A collection of scripts and models for TensorFlow users. From vision to NLP, it's all here.</p>
                <Link href="https://github.com/tensorflow/models" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Grab the Code <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">FastAI Library</h3>
                <p className="text-gray-300">High-level library for quick prototyping of deep learning models. Perfect for beginners and pros alike.</p>
                <Link href="https://github.com/fastai/fastai" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Grab the Code <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">ONNX (Open Neural Network Exchange)</h3>
                <p className="text-gray-300">Convert models between frameworks with this open format. Interoperability for the win!</p>
                <Link href="https://github.com/onnx/onnx" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Grab the Code <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Gradio by Hugging Face</h3>
                <p className="text-gray-300">Create interactive demos for your models with just a few lines of code. Show off your work!</p>
                <Link href="https://github.com/gradio-app/gradio" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Grab the Code <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">LangChain</h3>
                <p className="text-gray-300">Framework for developing apps powered by LLMs. Makes chaining together prompts, models and data sources stupid easy.</p>
                <Link href="https://github.com/langchain-ai/langchain" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Access repo <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">GGUF Model Format</h3>
                <p className="text-gray-300">Optimized format for running large models efficiently on consumer hardware. Run Llama 2 on your laptop - straight fire.</p>
                <Link href="https://github.com/ggerganov/llama.cpp" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Access repo <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Diffusers Library</h3>
                <p className="text-gray-300">Hugging Face library for state-of-the-art diffusion models. Text-to-image generation without the headaches.</p>
                <Link href="https://github.com/huggingface/diffusers" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Access repo <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">PEFT</h3>
                <p className="text-gray-300">Parameter-Efficient Fine-Tuning library. Fine-tune massive models without breaking your GPU or wallet - bussin'.</p>
                <Link href="https://github.com/huggingface/peft" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Access repo <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-3xl mr-2">📚</span>
              <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">Learning Resources & Tutorials</span>
            </h2>
            <p className="text-gray-300 mb-6">
              Get that knowledge gains with these fire resources. From noob to pro speedrun with tutorials
              that aren't mid. Stan these learning platforms and thank us later.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Hugging Face Tutorials</h3>
                <p className="text-gray-300">Official guides on using Transformers for NLP, vision, and more. Step-by-step realness.</p>
                <Link href="https://huggingface.co/docs/transformers/tutorials" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Start Learning <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">DeepLearning.AI Courses</h3>
                <p className="text-gray-300">Free and paid courses on AI, deep learning, and NLP by Andrew Ng and team.</p>
                <Link href="https://www.deeplearning.ai/" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Start Learning <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">PyTorch Tutorials</h3>
                <p className="text-gray-300">Learn PyTorch from the ground up with these official tutorials for all skill levels.</p>
                <Link href="https://pytorch.org/tutorials/" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Start Learning <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">TensorFlow Tutorials</h3>
                <p className="text-gray-300">Master TensorFlow with guides on building and deploying models for any use case.</p>
                <Link href="https://www.tensorflow.org/tutorials" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Start Learning <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">YouTube AI Legends</h3>
                <p className="text-gray-300">Follow these YouTubers for no-BS AI tutorials. Yannic Kilcher, Two Minute Papers, and AI Coffee Break are dropping knowledge bombs daily.</p>
                <Link href="https://www.youtube.com/c/YannicKilcher" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Subscribe <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">AI Twitter Spaces</h3>
                <p className="text-gray-300">Twitter/X is where AI goes viral first. Follow accounts like @SamAltman, @karpathy, and @marktenenholtz for the freshest AI tea.</p>
                <Link href="https://twitter.com/i/topics/1530904132899463168" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">AI Discord Communities</h3>
                <p className="text-gray-300">Eleuther AI, Hugging Face, and Stable Diffusion Discord servers are popping. Real-time help from AI gigabrains is unmatched.</p>
                <Link href="https://discord.com/invite/huggingface" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Join <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Free Neural Nexus Workshops</h3>
                <p className="text-gray-300">We host free workshops every week. Come thru and level up your AI skills with our team. From basic LLM fine-tuning to crazy diffusion hacks.</p>
                <Link href="/workshops" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Register <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-3xl mr-2">👥</span>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Community Vibes & Collabs</span>
            </h2>
            <p className="text-gray-300 mb-6">
              Link up with the squad and build together. The AI community is elite - slide into these spaces and find your people.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Neural Nexus Discord</h3>
                <p className="text-gray-300">Our Discord server is poppin'. Share your projects, ask for help, find collaborators. Good vibes only.</p>
                <Link href="#" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Join the server <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">HuggingFace Community</h3>
                <p className="text-gray-300">The HF community is goated. Share your models, get feedback, and collab with AI enthusiasts worldwide.</p>
                <Link href="https://huggingface.co/join" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">AI Hackathons</h3>
                <p className="text-gray-300">Build something crazy in 48 hours. Meet other devs, win prizes, and flex your AI skills. It's a whole vibe.</p>
                <Link href="https://devpost.com/hackathons?topics[]=artificial-intelligence" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Find events <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Contribute to Neural Nexus</h3>
                <p className="text-gray-300">Our GitHub is open for PRs. Add your own models, fix bugs, or suggest new features. We're all about that open source life.</p>
                <Link href="https://github.com" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  GitHub repo <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-8 rounded-2xl border border-blue-500/30">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Join The AI Revolution</h2>
              <p className="text-xl text-gray-300 mb-6">
                Don't just scroll, be part of the movement. The open-source AI community is your tribe - we're building the future together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                  Create Account
                </Link>
                <Link href="https://github.com" className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 border border-gray-600">
                  Star Our Repo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 