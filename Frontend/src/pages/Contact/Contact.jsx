import styles from './Contact.module.css'

const Contact = () => {
  return (
    <section id='contact' className={styles.contact}>
      <div className={styles.contactLeft}>
          <div className={styles.contactTitle}>Get in touch</div>
          <div className={styles.contactDescription}>
            I'm open to new opportunities and collaborations. Whether you have a question, a project idea, or just want to say hello, feel free to reach out!
          </div>
          <div className={styles.contactInfo}>
            <div className={styles.contactInfoItem}>
              <div className={styles.contactInfoImage}>
                <svg className={styles.contactInfoIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l208 156c17.1 12.8 40.5 12.8 57.6 0l208-156c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48L48 64zM0 196L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-188-198.4 148.8c-34.1 25.6-81.1 25.6-115.2 0L0 196z"/></svg>
              </div>
              <div className={styles.contactInfoText}>
                <div className={styles.contactInfoHeadLink}><strong>Email:</strong></div>
                <div className={styles.contactInfoLink}>pardeepshyoran@outlook.com</div>
              </div>
            </div>
            <div className={styles.contactInfoItem}>
              <div className={styles.contactInfoImage}>
                <svg className={styles.contactInfoIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M160.2 25C152.3 6.1 131.7-3.9 112.1 1.4l-5.5 1.5c-64.6 17.6-119.8 80.2-103.7 156.4 37.1 175 174.8 312.7 349.8 349.8 76.3 16.2 138.8-39.1 156.4-103.7l1.5-5.5c5.4-19.7-4.7-40.3-23.5-48.1l-97.3-40.5c-16.5-6.9-35.6-2.1-47 11.8l-38.6 47.2C233.9 335.4 177.3 277 144.8 205.3L189 169.3c13.9-11.3 18.6-30.4 11.8-47L160.2 25z"/></svg>
              </div>
              <div className={styles.contactInfoText}>
                <div className={styles.contactInfoHeadLink}><strong>Phone:</strong></div>
                <div className={styles.contactInfoLink}>+91 97297 75889</div>
              </div>
            </div>
            <div className={styles.contactInfoItem}>
              <div className={styles.contactInfoImage}>
                <svg className={styles.contactInfoIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm5 170.2l66.5 0 0 213.8-66.5 0 0-213.8zm71.7-67.7a38.5 38.5 0 1 1 -77 0 38.5 38.5 0 1 1 77 0zM317.9 416l0-104c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9l0 105.8-66.4 0 0-213.8 63.7 0 0 29.2 .9 0c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9l0 117.2-66.4 0z"/></svg>
              </div>
              <div className={styles.contactInfoText}>
                <div className={styles.contactInfoHeadLink}><strong>Linkedin:</strong></div>
                <div className={styles.contactInfoLink}>https://www.linkedin.com/in/pardeepshyoran/</div>
              </div>
            </div>
        </div>
      </div>
      <div className={styles.contactRight}>
        <img src="https://ik.imagekit.io/00zfvrear/Images/man-in-long-shirt-white-pointing-side-with-both-index-fingers-3d-illustration-of-a-smart-businessman-pointing-png.webp?updatedAt=1760714540976" alt="" />
      </div>
    </section>
  )
}

export default Contact