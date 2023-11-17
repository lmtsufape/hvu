import TemplateSecretario from './TemplateSecretario';
import TemplateTutor from './TemplateTutor';
import TemplateCadastros from './TemplateCadastros';

function TemplateWrapper({ layout, children, ...props }) {
  switch (layout) {
    case 'secretario':
      return <TemplateSecretario>{children}</TemplateSecretario>;
    case 'tutor':
      return <TemplateTutor>{children}</TemplateTutor>;
      case 'cadastro':
        return <TemplateCadastros>{children}</TemplateCadastros>;
    default:
      return <>{children}</>;
  }
}

export default TemplateWrapper
