import styles from "@/components/MeusAgendamentos/index.module.css"
import { SubHeader01 } from "../SubHeader"
import Image from "next/image";

export default function MeusAgendamentos(){
    return(
        <div>
            <div>
                <Image src="/images/IconMenorQue.svg" alt="Voltar" width={27} height={24}/>
            </div>
        </div>
    )
}