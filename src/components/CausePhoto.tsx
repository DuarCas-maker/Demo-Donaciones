const photos = {
  education: { src: '/images/educacion.jpg', alt: 'Docente y estudiantes participando en una actividad de aprendizaje', position: '85% 45%' },
  food: { src: '/images/alimentacion.jpg', alt: 'Voluntarios compartiendo alimentos con su comunidad', position: '50% 45%' },
  nature: { src: '/images/naturaleza.jpg', alt: 'Personas cultivando juntas en un huerto', position: '50% 20%' },
};
export function CausePhoto({ kind = 'education', hero = false }: { kind?: keyof typeof photos; hero?: boolean }) {
  const photo = photos[kind];
  return <img className={hero ? 'hero-art project-photo' : 'cause-art project-photo'} src={photo.src} alt={photo.alt} style={{ objectPosition: photo.position }} loading={hero ? 'eager' : 'lazy'} decoding="async" width={1400} height={933}/>;
}
