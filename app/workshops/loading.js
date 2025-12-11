import Image from "next/image";

export default function LoadingWorkshops() {
  return (
    <section className="site-loader" aria-label="Loading workshops">
      <div className="site-loader__logoWrap">
        <Image
          src="/images/logo-big.svg"
          alt="Nima Schmuck"
          width={340}
          height={140}
          priority
          className="site-loader__logo"
        />
      </div>
    </section>
  );
}
