// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import tutorStyles from "./FormularioCadastroTutor/formulariocadastrotutor.module.css";
// import enderecoStyles from "./FormularioCadastroEndereco/formulariocadastroendereco.module.css";
// import { useRouter } from "next/router";
// import { createTutor } from "../../services/tutorService";
// import { VoltarWhiteButton } from "./WhiteButton/white_button";

// // Componente para o formulário de informações pessoais
// const TutorInfoForm = ({ onSubmit }) => {
//   const router = useRouter();

//   const [formularioTutor, setFormularioTutor] = useState({
//     nome: "",
//     email: "",
//     senha: "",
//     cpf: "",
//     rg: "",
//     telefone: ""
//   });

//   const handleChange = (e) => {
//     setFormularioTutor({
//       ...formularioTutor,
//       [e.target.name]: e.target.value
//     });
//   };
  
//   const handleSubmit = async (event) => {
//     event.preventDefault();
  
//     try {
//       const response = await createTutor(formularioTutor);
  
//       if (response.ok) {
//         router.push('/cadastroendereco');
//       } else {
//         console.error('Falha ao cadastrar tutor na API');
//       }
//     } catch (error) {
//       console.error('Erro ao processar solicitação:', error);
//     }
//   };

//   return (
//     <div className={`${tutorStyles.boxcadastrotutor} ${tutorStyles.container}`}>
//         <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//                 <label htmlFor="nome" className="form-label">Nome Completo</label>
//                 <input
//                     type="text"
//                     className="form-control"
//                     name="nome"
//                     placeholder="Insira o nome completo"
//                     value={formularioTutor.nome}
//                     onChange={handleChange}
//                 />
//             </div>
//             <div className="mb-3">
//                 <label htmlFor="email" className="form-label">E-mail</label>
//                 <input
//                     type="email"
//                     className="form-control"
//                     name="email"
//                     placeholder="Insira o seu e-mail"
//                     value={formularioTutor.email}
//                     onChange={handleChange}
//                 />
//             </div>
//             <div className="mb-3">
//                 <label htmlFor="senha" className="form-label">Senha</label>
//                 <input
//                     type="password"
//                     className="form-control"
//                     name="senha"
//                     placeholder="Insira uma senha"
//                     value={formularioTutor.senha}
//                     onChange={handleChange}
//                 />
//             </div>
//             <div className="mb-3">
//                 <label htmlFor="cpf" className="form-label">CPF</label>
//                 <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Ex: 123.456.789-00"
//                     name="cpf"
//                     value={formularioTutor.cpf}
//                     onChange={handleChange}
//                 />
//             </div>
//             <div className="mb-3">
//                 <label htmlFor="rg" className="form-label">RG</label>
//                 <input
//                     type="text"
//                     className="form-control"
//                     name="rg"
//                     placeholder="Insira o RG"
//                     value={formularioTutor.rg}
//                     onChange={handleChange}
//                 />
//             </div>
//             <div className="mb-3">
//                 <label htmlFor="telefone" className="form-label">Telefone para contato</label>
//                 <input
//                     type="tel"
//                     className="form-control"
//                     name="telefone"
//                     placeholder="(xx) xxxxx-xxxx"
//                     value={formularioTutor.telefone}
//                     onChange={handleChange}
//                 />
//             </div>
//             <div className={tutorStyles.continuarbotao}>
//                 <button type="submit" className={tutorStyles.green_button}>
//                     Continuar
//                 </button>
//             </div>
//         </form>
//     </div>
//   );
// };

// // Componente para o formulário de endereço
// const EnderecoInfoForm = ({ onSubmit }) => {

//   const router = useRouter();

//   const [formularioEndereco, setFormularioEndereco] = useState({
//     cep: '',
//     rua: '',
//     municipio: '',
//     cidade: '',
//     numero: 0,
//     bairro: ''
//   });

//   const handleChange = (e) => {
//     setFormularioEndereco({
//       ...formularioEndereco,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
  
//     try {
//       const response = await createTutor(formularioEndereco);
  
//       if (response.ok) {
//         router.push('/confirmacao');
//       } else {
//         console.error('Falha ao cadastrar tutor na API');
//       }
//     } catch (error) {
//       console.error('Erro ao processar solicitação:', error);
//     }
//   };

//   return (
//     <div className={`${enderecoStyles.boxcadastrotutor} ${enderecoStyles.container}`}>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//             <label for="rua" className="form-label">Rua</label>
//             <input type="text" 
//               className="form-control" 
//               name="rua"
//               placeholder="Ex: Avenida Bom Pastor"
//               value={formularioEndereco.endereco.rua}
//               onChange={handleChange}>
//             </input>
//         </div>

//         <div className="mb-3">
//           <label for="bairro" className="form-label">Bairro</label>
//           <input type="text" 
//             className="form-control" 
//             name="bairro" 
//             placeholder="Ex: Centro"
//             value={formularioEndereco.endereco.bairro}
//             onChange={handleChange}>
//           </input>
//         </div>

//         <div className="mb-3">
//           <div className="row">
//               <div className="col ">
//                 <label for="estado" className="form-label">Número</label>
//                 <input type="text" 
//                   className="form-control" 
//                   name="numero"
//                   placeholder="Ex: 140" 
//                   value={formularioEndereco.endereco.numero}
//                   onChange={handleChange}>
//                 </input>
//               </div>
//               <div className="col">
//                 <label for="cidade" className="form-label">CEP</label>
//                 <input type="text" 
//                   className="form-control" 
//                   name="cep"
//                   placeholder="Ex: 55250-000" 
//                   value={formularioEndereco.endereco.cep}
//                   onChange={handleChange}>
//                 </input>
//               </div>
//             </div>
        
//           <div className={enderecoStyles.espacodosforms}>
//             <div className="row">
//               <div className="col ">
//                 <label for="municipio" className="form-label">Município</label>
//                 <input type="text" 
//                   className="form-control" 
//                   name="municipio"
//                   placeholder="Ex: Pernambuco" 
//                   value={formularioEndereco.endereco.municipio}
//                   onChange={handleChange}>
//                 </input>
//               </div>
//               <div class="col">
//                 <label for="cidade" className="form-label">Cidade</label>
//                 <input type="text" 
//                   className="form-control" 
//                   name="cidade"
//                   placeholder="Ex: Garanhuns" 
//                   value={formularioEndereco.endereco.cidade}
//                   onChange={handleChange}>
//                 </input>
//               </div>
//             </div>
//             <div className={enderecoStyles.continuarbotao}>
//                 <VoltarWhiteButton/>
//                 <button type="submit" className={enderecoStyles.green_button}>
//                     Continuar
//                 </button>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// // Componente principal que renderiza ambos os formulários
// const RegistrationPage = () => {
//   const handleTutorSubmit = (personalInfo) => {
//     // Aqui você pode lidar com os dados pessoais, talvez armazená-los no estado do componente
//     // ou enviá-los para o servidor
//     console.log('Dados pessoais:', personalInfo);
//   };

//   const handleEnderecoSubmit = (address) => {
//     // Aqui você pode lidar com os dados de endereço, por exemplo, enviá-los para o servidor
//     console.log('Dados de endereço:', address);
//   };

//   return (
//     <div>
//       <h1>Cadastro</h1>
//       {/* Renderiza o formulário de informações pessoais */}
//       <TutorInfoForm onSubmit={handleTutorSubmit} />
//       {/* Renderiza o formulário de endereço */}
//       <EnderecoInfoForm onSubmit={handleEnderecoSubmit} />
//     </div>
//   );
// };

// export default RegistrationPage;
