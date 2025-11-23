<script>
  import { Picture, Image, BackgroundImage } from "$lib";
</script>

<div class="container">
  <h1>G3 ImageTools Test</h1>

  <section>
    <h2>1. Basic Image Component</h2>
    <p>Standard responsive image (test.png)</p>
    <div style="width: 100%;" class="image-wrapper">
      <Image
        src="../assets/landscape.png"
        alt="Test Image"
        style="width: 100%;"
      />
    </div>
  </section>

  <section>
    <h2>2. Picture Component</h2>
    <p>Multiple formats and sizes (mobile.jpg)</p>
    <div class="image-wrapper">
      <Picture
        src="../assets/portrait.png"
        alt="Mobile Image"
        formats={["avif", "webp", "jpeg"]}
        width={500}
        fit="fill"
        style="width: 100%;"
      />
    </div>
  </section>

  <section>
    <h2>3. Art Direction</h2>
    <p>
      Switch image based on viewport (mobile.jpg on small screens, test.png on
      large)
    </p>
    <div class="image-wrapper">
      <Picture
        src="../assets/landscape.png"
        alt="Art Direction Example"
        style="width: 100%; "
        placeholder="pixelated"
        artDirectives={[
          { media: "(max-width: 600px)", src: "../assets/square.png" },
        ]}
      />
    </div>
  </section>

  <section>
    <h2>4. Background Image</h2>
    <p>Image as background (mobile.jpg)</p>
    <BackgroundImage src="../assets/square.png" class="hero-bg">
      <div class="hero-content">
        <h3>Background Content</h3>
      </div>
    </BackgroundImage>
  </section>
  <section>
    <h2>5. Pixelated Placeholder</h2>
    <p>Low-res pixelated placeholder while loading.</p>
    <div class="image-wrapper">
      <Image
        src="../assets/square.png"
        alt="Pixelated Placeholder Test"
        width={400}
        placeholder="pixelated"
        style="width: 100%;"
      />
    </div>
  </section>
</div>

<style>
  .container {
    max-width: 700px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, sans-serif;
  }

  section {
    margin-bottom: 3rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 2rem;
  }

  .image-wrapper {
    width: 100%;
  }

  .hero-bg {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .hero-content {
    background: rgba(0, 0, 0, 0.3);
    padding: 1rem 2rem;
    border-radius: 4px;
  }
</style>
