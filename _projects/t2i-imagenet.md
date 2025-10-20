---
title: How far can we go with ImageNet for Text-to-Image generation?
subtitle: Training high-quality text-to-image generation models with 1/10th the parameters, 1/1000th the training images, in about 500 H100 hours
date: 2025-02-01
image: /assets/images/projects/t2i_imagenet/teaser.png
github: https://github.com/lucasdegeorge/T2I-ImageNet
paper: https://arxiv.org/abs/2502.21318
huggingface_models: https://huggingface.co/Lucasdegeorge/CAD-I
huggingface_datasets: https://huggingface.co/arijitghosh/datasets
website: 
---

<div class="project-image-header">
  <img src="/assets/images/projects/t2i_imagenet/teaser.png" alt="T2I-ImageNet Teaser" class="img-fluid">
</div>

<div class="project-authors">
  <a href="https://lucasdegeorge.github.io/">Lucas Degeorge</a>, 
  <a href="https://arijit-hub.github.io/">Arijit Ghosh</a>, 
  <a href="https://nicolas-dufour.github.io/">Nicolas Dufour</a>, 
  <a href="https://vicky.kalogeiton.info/">Vicky Kalogeiton</a>, 
  <a href="https://davidpicard.github.io/">David Picard</a>
</div>

## Overview

The common belief in text-to-image (T2I) generation is that larger training datasets lead to better performance, pushing the field towards billion-scale datasets. However, this "bigger is better" approach often overlooks data efficiency, reproducibility, and accessibility, as many large datasets are closed-source or decay over time.

**Our work challenges this paradigm.** We demonstrate that it's possible to match or even outperform models trained on massive web-scraped collections by using **only ImageNet**, a widely available and standardized dataset. By enhancing ImageNet with carefully designed text and image augmentations, our approach achieves:

  - A **+6% overall score over SD-XL on GenEval** and **+5% on DPGBench**, using models with just **1/10th the parameters** and trained on **1/1000th the number of images**.
  - Our models (300M-400M parameters) can be trained with a significantly reduced compute budget (around **500 H100 hours**).
  - We also show successful scaling to higher resolution (512x512 and 1024x1024) generation under these constraints.

This research opens avenues for more reproducible and accessible T2I research, enabling more teams to contribute to the field without requiring massive compute resources or proprietary datasets. All our training data, code, and models are openly available.

## Adopting ImageNet for Text-to-Image Generation

#### 1. Long Informative Captions

ImageNet's original labels are simple class names, but the images contain rich visual information. We generate highly detailed captions that describe those images.

#### 2. Image Augmentations to Reduce Overfitting and Increase Compositionality

Models trained on ImageNet (even with text augmentation) can suffer from early overfitting due to its relatively small scale (1.2M images) and struggle with complex compositions due to its object-centric nature. We implement two Image Augmentation (IA) methods (CutMix and Crop) to mitigate those issues.

These IA strategies, when combined with text augmentation (TA+IA), demonstrably reduce overfitting and significantly improve compositional reasoning (+7 points on GenEval's "Two Objects" sub-task).

<div class="project-image">
  <img src="/assets/images/projects/t2i_imagenet/ta_tapia_comp.png" alt="Qualitative comparison across models" class="img-fluid">
  <p class="image-caption">
     Qualitative comparison: Text-Augmentation (TA, first, third columns) vs Text+Image Augmentation (TA+IA second, last columns) for four prompts. 
  </p>
</div>

## Comparison with State-of-the-Art

We compare our $512^2$ resolution model against the state-of-the-art. Despite using significantly fewer resources (parameters and training data), its demonstrates strong performance compared to established large-scale models.

<div class="project-image">
  <img src="/assets/images/projects/t2i_imagenet/bubble_plot.png" alt="Quantitative results on GenEval and DPGBench" class="img-fluid">
  <p class="image-caption">
    Quantitative results on GenEval (left) and DPGBench (right). The size of the bubble represents the number of parameters. Our models (labeled "Ours") achieve superior or comparable performance to much larger models trained on vastly more data.
  </p>
</div>

## Gallery

<div class="carousel-container">
  <div class="carousel-wrapper">
    <div class="carousel-slides">
      {% for i in (1..20) %}
      <div class="carousel-slide">
        <img src="/assets/images/projects/t2i_imagenet/carousel/{{ i | prepend: '000' | slice: -4, 4 }}.png" alt="Generated image {{ i }}" loading="lazy">
      </div>
      {% endfor %}
    </div>
    
    <button class="carousel-button prev" aria-label="Previous slide">‹</button>
    <button class="carousel-button next" aria-label="Next slide">›</button>
    
    <div class="carousel-counter">1 / 20</div>
    
    <div class="carousel-indicators">
      {% for i in (1..20) %}
      <button class="carousel-indicator" aria-label="Go to slide {{ i }}"></button>
      {% endfor %}
    </div>
  </div>
  <p class="image-caption">
    Example generations from our models following various text prompts. Use arrow buttons or swipe to navigate through the gallery.
  </p>
</div>


## Task Specific Finetuning: Aesthetic Quality

We demonstrate that our models can be effectively finetuned for specific tasks. Below, we compare our aesthetically-finetuned model against state-of-the-art models (SD-XL, PixArt, SD3-Medium) on the same prompts.

<div class="comparison-carousel-container">
  <div class="comparison-carousel-wrapper">
    <div class="comparison-carousel-slides">
      {% assign image_numbers = "000006,000012,000018,000028,000034,000040,000050,000056,000058,000088" | split: "," %}
      {% for img_num in image_numbers %}
      <div class="comparison-carousel-slide">
        <div class="comparison-image-container ours">
          <div class="comparison-image-label">Ours</div>
          <div class="comparison-image-wrapper">
            <img src="/assets/images/projects/t2i_imagenet/aesth_carousel/ours/{{ img_num }}.jpg" alt="Our model - {{ img_num }}" loading="lazy">
          </div>
        </div>
        
        <div class="comparison-image-container">
          <div class="comparison-image-label">SD-XL</div>
          <div class="comparison-image-wrapper">
            <img src="/assets/images/projects/t2i_imagenet/aesth_carousel/sdxl/{{ img_num }}.png" alt="SD-XL - {{ img_num }}" loading="lazy">
          </div>
        </div>
        
        <div class="comparison-image-container">
          <div class="comparison-image-label">PixArt</div>
          <div class="comparison-image-wrapper">
            <img src="/assets/images/projects/t2i_imagenet/aesth_carousel/pixart/{{ img_num }}.png" alt="PixArt - {{ img_num }}" loading="lazy">
          </div>
        </div>
        
        <div class="comparison-image-container">
          <div class="comparison-image-label">SD3-Medium</div>
          <div class="comparison-image-wrapper">
            <img src="/assets/images/projects/t2i_imagenet/aesth_carousel/sd3m/{{ img_num }}.png" alt="SD3-Medium - {{ img_num }}" loading="lazy">
          </div>
        </div>
      </div>
      {% endfor %}
    </div>
    
    <button class="comparison-carousel-button prev" aria-label="Previous comparison">‹</button>
    <button class="comparison-carousel-button next" aria-label="Next comparison">›</button>
    
    <div class="comparison-carousel-counter">1 / 10</div>
    
    <div class="comparison-carousel-indicators">
      {% for i in (1..10) %}
      <button class="comparison-carousel-indicator" aria-label="Go to comparison {{ i }}"></button>
      {% endfor %}
    </div>
  </div>
  <p class="image-caption">
    Side-by-side comparison of our aesthetically-finetuned model against state-of-the-art T2I models. Our model (highlighted) shows competitive or superior visual quality despite being trained on significantly less data. Use arrow buttons to navigate through different prompts.
  </p>
</div>

## BibTeX

```bibtex
@article{degeorge2025farimagenettexttoimagegeneration, 
     title           ={How far can we go with ImageNet for Text-to-Image generation?}, 
     author          ={Lucas Degeorge and Arijit Ghosh and Nicolas Dufour and David Picard and Vicky Kalogeiton}, 
     year            ={2025}, 
     journal         ={arXiv},
 }
```

## Acknowledgments

This work was granted access to the HPC resources of IDRIS under the allocation 2025-AD011015436 and 2025-AD011015594 made by GENCI, and by the SHARP ANR project ANR-23-PEIA-0008 funded in the context of the France 2030 program. The authors would like to thank Alexei A. Efros, Thibaut Loiseau, Yannis Siglidis, Yohann Perron, Louis Geist, Robin Courant and Sinisa Stekovic for their insightful comments, suggestions, and discussions.

---

*Published: February 2025*
