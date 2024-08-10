import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "./index.module.css";

function TelaAdministracao() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.box_button}>
                <button className={styles.button} onClick={() => router.push('/lapa/gerenciarEspecies')}>
                    <Image src="/especies.svg" alt="Espécies" width={62} height={62} />
                    <h6>Gerenciar Espécies</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/lapa/gerenciarAreas')}>
                    <Image src="/areas.svg" alt="Áreas" width={62} height={62} />
                    <h6>Gerenciar Áreas</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/lapa/gerenciarFotos')}>
                    <Image src="/fotos.svg" alt="Fotos" width={62} height={62} />
                    <h6>Gerenciar Fotos</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/lapa/gerenciarOrgaos')}>
                    <Image src="/orgaos.svg" alt="Órgãos" width={62} height={62} />
                    <h6>Gerenciar Órgãos</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/lapa/gerenciarRacas')}>
                    <Image src="/pets.svg" alt="Raças" width={62} height={62} />
                    <h6>Gerenciar Raças</h6>
                </button>
            </div>

            <div className={styles.box_button}>
                <button className={styles.button} onClick={() => router.push('/lapa/gerenciarEspecialidades')}>
                    <Image src="/clinical_notes.svg" alt="Especialidades" width={62} height={62} />
                    <h6>Gerenciar Especialidades</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/lapa/gerenciarEstagiarios')}>
                    <Image src="/estagiario.svg" alt="Estagiarios" width={62} height={62} />
                    <h6>Gerenciar Estagiários</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/lapa/gerenciarTutores')}>
                    <Image src="/tutor.svg" alt="Tutores" width={62} height={62} />
                    <h6>Gerenciar Tutores</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/lapa/gerenciarAnimais')}>
                    <Image src="/animais.svg" alt="Animais" width={62} height={62} />
                    <h6>Gerenciar Animais</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/lapa/gerenciarMedicos')}>
                    <Image src="/veterinarios.svg" alt="Veterinarios" width={62} height={62} />
                    <h6>Gerenciar Veterinários</h6>
                </button>
            </div>

            <div className={styles.box_button}>             
                <button className={styles.button} onClick={() => router.push('/lapa/gerenciarMacroscopias')}>
                    <Image src="/macroscopias.svg" alt="Laudos" width={62} height={62} />
                    <h6>Gerenciar Macroscopias</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/lapa/gerenciarMicroscopias')}>
                    <Image src="/macroscopias.svg" alt="Laudos" width={62} height={62} />
                    <h6>Gerenciar Microscopias</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/lapa/gerenciarLaudos')}>
                    <Image src="/laudos.svg" alt="Laudos" width={62} height={62} />
                    <h6>Gerenciar Laudos de Necropsias</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/lapa/gerenciarLaudosMicroscopias')}>
                    <Image src="/laudos.svg" alt="Laudos" width={62} height={62} />
                    <h6>Gerenciar Laudos de Histopatologias</h6>
                </button>
            </div>

        </div>
    );
}

export default TelaAdministracao;
