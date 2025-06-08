import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PrismaClient, Prisma, Document } from "@prisma/client";

export const run = async () => {
  const db = new PrismaClient();

  // Use the `withModel` method to get proper type hints for `metadata` field:
  const vectorStore = PrismaVectorStore.withModel<Document>(db).create(
    new OpenAIEmbeddings(),
    {
      prisma: Prisma,
      tableName: "Document",
      vectorColumnName: "vector",
      columns: {
        id: PrismaVectorStore.IdColumn,
        question: PrismaVectorStore.ContentColumn,
        answer: PrismaVectorStore.ContentColumn,
      },
    }
  );

  interface Faq {
    question: string;
    answer: string;
  }

  const faqs: Faq[] = [
    {
      question: "L'UIR est-elle reconnue par l'État marocain ?",
      answer:
        "Oui, l’Université Internationale de Rabat (UIR) est reconnue par l’État marocain depuis 2015, avec un renouvellement en 2020. Cette reconnaissance garantit que ses diplômes sont équivalents à ceux délivrés par les universités publiques marocaines.",
    },
    {
      question:
        "Les diplômes de l'UIR sont-ils équivalents aux diplômes nationaux ?",
      answer:
        "Oui. Les diplômes de l’UIR sont équivalents aux diplômes nationaux, car l’université est reconnue par l’État marocain depuis 2015, avec un renouvellement en 2020.",
    },
    {
      question: "Quel est le statut juridique de l'UIR ?",
      answer:
        "L’Université Internationale de Rabat (UIR) est une université privée à but non lucratif, créée dans le cadre d’un partenariat public-privé avec l’État marocain.",
    },
    {
      question: "Rabat Business School est-elle accréditée par l'AACSB ?",
      answer:
        "Oui. Rabat Business School est accréditée AACSB, un label d’excellence détenu par moins de 5 % des business schools dans le monde.",
    },
    {
      question:
        "L'UIR dispose-t-elle du label EUR-ACE pour ses formations en ingénierie ?",
      answer:
        "Oui. Les écoles d’ingénieurs de l’UIR sont labellisées EUR-ACE et accréditées par la CTI, ce qui garantit la qualité européenne des formations en ingénierie.",
    },
    {
      question:
        "Quels sont les partenaires académiques internationaux de l'UIR ?",
      answer:
        "L’UIR compte 262 partenariats académiques dans 57 pays. Ces accords permettent des échanges, doubles diplômes, programmes conjoints et mobilité étudiante, notamment en Europe, Amérique et Asie.",
    },
    {
      question: "L'UIR propose-t-elle des doubles diplômes ?",
      answer:
        "Oui. L’UIR propose plusieurs doubles diplômes en partenariat avec des universités internationales, notamment en Europe, en Amérique du Nord et en Asie. Ces accords concernent plusieurs collèges, dont Rabat Business School et les écoles d’ingénieurs.",
    },
    {
      question: "Quelle est la superficie du campus de l'UIR ?",
      answer: "Le campus de l’UIR s’étend sur 30 hectares.",
    },
    {
      question: "Quelles infrastructures sont disponibles sur le campus ?",
      answer:
        "Le campus de l’UIR dispose de : 🏡 résidences, 📚 bibliothèque, 🍽️ restauration, 🏊‍♂️ piscine, ⚽ terrains de sport, 🧪 laboratoires, 💡 Tech Center, 🏥 hôpital universitaire, 🌱 campus HQE.",
    },
    {
      question: "Combien de brevets ont été déposés par l'UIR ?",
      answer:
        "L’UIR a déposé 650 brevets, dont 108 à l’international, ce qui en fait la 1ère université en Afrique et dans la région MENA en matière de brevets (source : OMPIC).",
    },
    {
      question:
        "Combien de chercheurs de l'UIR figurent parmi les 2 % des meilleurs mondiaux ?",
      answer:
        "6 chercheurs de l’UIR figurent parmi les 2 % des meilleurs scientifiques au monde, selon le classement de l’Université Stanford.",
    },
    {
      question: "L'UIR possède-t-elle un hôpital universitaire ?",
      answer:
        "Oui. L’UIR dispose d’un Hôpital Universitaire International en cours de finalisation, avec une ouverture prévue en 2025. Il comptera 450 lits et proposera des soins dans 15 spécialités médicales et chirurgicales.",
    },
    {
      question: "Le campus de l'UIR est-il certifié HQE ?",
      answer:
        "Oui. Le campus de l’UIR est certifié HQE (Haute Qualité Environnementale) — c’est le premier campus en Afrique à avoir obtenu cette distinction.",
    },
    {
      question: "L'UIR dispose-t-elle d'une centrale photovoltaïque ?",
      answer:
        "Oui. L’UIR dispose d’une centrale photovoltaïque sur son campus, avec une capacité de production annuelle de 470 MWh. Elle fait partie des équipements durables du campus",
    },
    {
      question: "Comment contacter l'UIR pour des informations générales ?",
      answer: "",
    },
    {
      question:
        "Quels dossiers seront pris en compte pour l'obtention d'une bourse à l'UIR ?",
      answer:
        "Seuls les dossiers de bourse déposés en ligne seront traités par nos services. Les dossiers incomplets ou déposés hors-délais seront systématiquement rejetés.",
    },
    {
      question:
        "Quels dossiers seront pris en compte pour l'obtention d'une bourse à l'UIR ?",
      answer:
        "Seuls les dossiers de bourse déposés en ligne seront traités par nos services. Les dossiers incomplets ou déposés hors-délais seront systématiquement rejetés.",
    },
    {
      question:
        "Est-ce que les étudiants ayant déjà bénéficié d'une bourse peuvent faire un recours ?",
      answer:
        "Non, les étudiants ayant déjà bénéficié d'une bourse et qui font un recours ne peuvent, en aucun cas, redéposer leurs demandes en ligne.",
    },
    {
      question: "Est-ce que la bourse est reconduite en cas de redoublement ?",
      answer:
        "Non, la bourse octroyée par l'UIR n'est pas reconduite en cas de redoublement.",
    },
    {
      question: "Quels frais sont couverts par la bourse de l'UIR ?",
      answer:
        "La bourse octroyée par l'UIR couvre exclusivement les frais de scolarité à l'UIR, que ce soit partiellement ou totalement. Elle ne couvre pas les frais de scolarité qui sont dus chez les partenaires académiques de l'UIR, par exemple, dans le cas de cursus en double diplomation.",
    },
    {
      question: "Quelles sont les bourses d'études proposées par l'UIR ?",
      answer:
        "L'UIR propose des bourses d'études partielles ou totales réservées aux meilleurs étudiants qui se trouvent dans l'incapacité de payer les frais de scolarité.",
    },
    {
      question: "Qu'est-ce que la bourse d'études couvre-t-elle ?",
      answer: `La bourse d'études correspond à une réduction partielle ou à une exonération totale des frais de scolarité, et éventuellement des frais de logement. Elle est destinée aux étudiants issus de milieux défavorisés ou modestes. Les détails sur les modalités de la bourse sont décrits dans le "Règlement pour l'octroi d'une bourse d'études".`,
    },
    {
      question:
        "Quels documents sont nécessaires pour constituer le dossier de bourse ?",
      answer: `Le dossier de bourse comprend le formulaire de bourse à renseigner en ligne, ainsi que d'autres pièces demandées. Vous devez le déposer en ligne à partir de "bourse.uir.ac.ma" en utilisant votre adresse e-mail UIR et votre mot de passe. Ce dossier permettra à l'UIR de prendre connaissance de votre situation financière et familiale actuelle. Assurez-vous de fournir toutes les pièces demandées pour permettre à la commission d'évaluer votre dossier de manière appropriée. Soyez assuré que toutes les informations transmises à la commission sont confidentielles.`,
    },
    {
      question: "Quels types de bourses propose l’UIR ?",
      answer:
        "L’UIR propose 3 types de bourses selon les profils : Bourse sociale Bourse sportive Bourse sociale  Bourse spéciale",
    },
    {
      question: "Qu’est-ce qu’une bourse sociale ?",
      answer:
        "La bourse sociale est destinée aux étudiants dont la situation financière nécessite un soutien. Elle est attribuée sur critères sociaux après étude de dossier.",
    },
    {
      question: "Qu’est-ce qu’une bourse sportive ?",
      answer:
        "La bourse sportive est accordée aux étudiants ayant un excellent niveau sportif, reconnu par un palmarès ou une participation à des compétitions officielles.",
    },
    {
      question: "Qu’est-ce qu’une bourse spéciale ?",
      answer:
        "La bourse spéciale est octroyée dans le cadre de partenariats spécifiques ou selon certains critères prédéfinis (institutionnels, associatifs, etc.).",
    },
    {
      question: "Peut-on cumuler plusieurs bourses ?",
      answer:
        "Non, il n’est pas possible de cumuler plusieurs bourses à l’UIR. Une seule bourse peut être attribuée par étudiant, selon le type de dossier.",
    },
    {
      question: "Où déposer ma demande de bourse ?",
      answer:
        "Rendez-vous sur bourse.uir.ac.ma pour remplir le formulaire et soumettre les documents demandés.",
    },
    {
      question: "Où déposer ma demande de bourse ?",
      answer:
        "Rendez-vous sur bourse.uir.ac.ma pour remplir le formulaire et soumettre les documents demandés.",
    },
    {
      question: "Est-ce que l’UIR est une université publique ?",
      answer:
        "L’Université Internationale de Rabat est une université semi-publique. Elle est la première université marocaine créée en partenariat avec l’Etat marocain concrétisant ainsi le premier partenariat public-privé dans le secteur de l’enseignement supérieur.",
    },
    {
      question: "L’UIR est-elle reconnue par l’état ?",
      answer:
        "L’Université Internationale de Rabat est reconnue par l’Etat. La reconnaissance signifie que les diplômes délivrés par l’UIR sont équivalents aux diplômes délivrés par les établissements publics, permettant ainsi d’accéder à la fonction publique, aux concours d’Etat et aux centres doctoraux.",
    },
    {
      question: "Quels sont les établissements ou les écoles de l’UIR ?",
      answer: `L’Université Internationale de Rabat est constituée de 4 collèges distincts, chaque collège englobe à son tour plusieurs écoles/facultés :
  Collège of  Social Sciences
  Sciences Po
  Ecole de droit de Rabat
  IHECS Afrique communication et Médias
  Collège of Engineering & Architecture
  Ecole Supérieure d’Ingénierie de l’Energie
  School of Aerospace Engineering & Automotive Engineering
  Ecole Supérieure d’Informatique et du Numérique
  Ecole d'Ingénierie en Topographie de Rabat
  Ecole d’Architecture de Rabat
  Collège of Health Sciences
  Faculté Internationale de Médecine Dentaire
  Faculté Internationale de Médecine de Rabat
  Ecole Supérieure des Sciences Paramédicales de Rabat
  Collège of Management
  Rabat Business School `,
    },
    {
      question: "Pourquoi s’inscrire à l’UIR ?",
      answer: `L’Université Internationale de Rabat est la première université créée dans le cadre d’un partenariat public-privé au Maroc, elle propose une offre de formation pluridisciplinaire élargie avec différentes filières dans des domaines de pointe (ingénierie, sciences politiques, communication, média, architecture, médecine dentaire, management)   
  L’UIR est dotée d’un campus moderne sur 300 000 m2 (30 hectares) permettant aux étudiants de vivre une expérience unique, épanouie et riche. `,
    },
    {
      question:
        "Comment puis-je choisir pour quel établissement de l’UIR candidater ?",
      answer:
        "Le choix de l’établissement revient à faire un choix par rapport au métier que tu souhaites exercer dans le futur. Le département promotion de l’UIR se charge de t’orienter et répondre à toutes tes questions.",
    },
    {
      question:
        "Y-a-t-il un processus d’accompagnement lors de la première année à l’UIR ?",
      answer: `A chaque rentrée universitaire, l’Université Internationale de Rabat accorde une grande importance à l’intégration de ses nouveaux étudiants, elle organise ainsi une semaine d’intégration pour les accueillir dans cette nouvelle aventure. En plus de la semaine d’intégration, différentes activités sont mises en place en coordination avec le BDE (Bureau Des Etudiants) afin de faire découvrir aux nouveaux le campus, les anciens étudiants ainsi que pour se familiariser avec le staff administratif et professeurs.
      
  Après cette semaine, l’UIR accompagne activement ses étudiants tout au long de leur cursus universitaire, le corps professoral et administratif sont tous impliqués que ça soit dans le cadre des études et échanges à l’international, ou via une cellule d’écoute, un service pour l’assistance lors de la recherche de stage et un département spécial pour la vie estudiantine et associative des étudiants.`,
    },
    {
      question:
        "Existe-t-il un service d’orientation et accompagnement pour les bacheliers ?",
      answer:
        "L’UIR est dotée d’un département promotion qui se charge d’orienter les étudiants et de répondre à leurs interrogations.",
    },
    {
      question: "Existe-t-il des programmes en anglais ?",
      answer: `Oui, l’Université Internationale de Rabat propose des programmes en anglais tels que dans l’école de management « Rabat Business School », l'école d’ingénierie automobile et aéronautique.
      
  Dans les autres programmes, l’anglais est une langue qui occupe tout aussi bien une grande importance, elle y est enseignée tout au long du parcours universitaire.    `,
    },
    {
      question:
        "Puis-je changer de programme de formation au cours d’une année universitaire ?",
      answer:
        "Non, il est impossible de changer de programme de formation au cours d’une année universitaire, il faut attendre la fin de l’année universitaire pour le faire.",
    },
    {
      question:
        "Quelle est la différence entre la formation initiale et la formation continue ?",
      answer:
        "La formation initiale est un type de formation destinée aux étudiants principalement, à l’inverse de la formation continue qui s’adresse aux professionnels (salariés, entrepreneurs, fonctionnaires) ou aux personnes dotées d’une expérience professionnelle et qui envisagent de se former pour diverses raisons (obtenir un diplôme de niveau supérieur, se reconvertir, changer de spécialisation…)",
    },
    {
      question: "Que comprennent les frais de scolarité à l’UIR ?",
      answer: `Les frais de scolarité couvrent :
  L’enseignement académique de haut niveau
  L’accès aux infrastructures sportives
  Les cours de langues optionnels
  Les frais ne couvrent pas : transport, restauration, hébergement ou dépenses personnelles.`,
    },
    {
      question: "Quel est le montant des frais d’inscription à l’UIR ?",
      answer: `Les frais d’inscription varient selon les collèges :
  10 000 DHS pour la majorité des formations
  20 000 DHS pour le programme ITB (Collège de Management)
  📌 Ces frais sont non remboursables.`,
    },
    {
      question: "Quels sont les frais de scolarité pour un bachelier ?",
      answer: `Cela dépend du programme choisi. Voici quelques exemples :
  Médecine : 120 000 DHS/an
  Architecture : 85 000 DHS/an
  Droit, Économie, Sciences Politiques… : 62 000 DHS/an
   Les frais sont annuels, à régler à l’inscription.`,
    },
    {
      question: "Comment puis-je payer mes frais de scolarité ?",
      answer: `Trois options sont disponibles :
  Paiement en ligne par carte bancaire via le site web
  Virement ou versement bancaire auprès d’une agence CIH Bank
  Paiement par chèque bancaire`,
    },
    {
      question: "Quelles sont les coordonnées bancaires de l’UIR ?",
      answer: `Pour les étudiants marocains :
  RIB : CIH BANK 230 810 594 293 822 101 460 075
  Swift : CIHMMAMC
  Bénéficiaire : Université Internationale de Rabat
  
  📌 Pour les étudiants internationaux :
  IBAN : CIH BANK MA64230810594293822103320341
  Swift : CIHMMAMC
  Bénéficiaire : Université Internationale de Rabat`,
    },
    {
      question: "Que dois-je faire après avoir effectué un virement ?",
      answer: `Scannez le justificatif de paiement
   Indiquez votre nom et prénom
  Envoyez-le par mail à : comptable@uir.ac.ma`,
    },
    {
      question: "Que se passe-t-il en cas de retard de paiement ?",
      answer: `L’UIR peut entamer une procédure de recouvrement.
  Mais une facilité de paiement peut être accordée, sur demande et après étude de votre dossier.`,
    },
    {
      question: "Puis-je bénéficier d’une bourse ou d’un prêt étudiant ?",
      answer:
        "Oui ! L’UIR propose des solutions de financement (bourses, prêts) pour accompagner les étudiants dans le besoin.",
    },
    {
      question: "Quand faut-il déposer la demande de financement ?",
      answer: `Lors de l’inscription, en plus du règlement des frais d’inscription.
   Il faut aussi remettre deux titres de paiement couvrant la totalité des frais de scolarité.`,
    },
    {
      question:
        "Où puis-je trouver plus d’informations sur les bourses ou prêts ?",
      answer:
        "Pour plus d’informations, vous pouvez consulter notre site web bourse.uir.ac.ma ou écrire à : bourse@uir.ac.ma",
    },
    {
      question: "Est-ce que les chambres de la résidence sont équipées ?",
      answer: `Oui, les chambres du complexe résidentiel de l’UIR sont équipées de :
  Sommier et matelas
  Bureau
  Etagères
  Placards de rangement à clé
  Sanitaires (lavabo, WC, douche, évier, miroir)
  Rideaux en tissu
  Mini réfrigérateur
  Chauffage électrique`,
    },
    {
      question: "Le campus dispose-t-il d’un restaurant ?",
      answer:
        "Oui le campus dispose d'un restaurant universitaire et 4 cafétérias qui offrent aux étudiants des repas équilibrés à prix modique au plus près de leur lieu de formation.",
    },
    {
      question: "Y-a-t-il un couvre-feu pour la résidence ?",
      answer: `Les horaires d'accès de la cité universitaire sont de 06h00 à 00h00 et les horaires de visites, de 09h00 à 22h30.`,
    },
    {
      question: `Est-ce que l’université propose des services médicaux aux étudiants ?`,
      answer: `Afin de veiller sur la santé de ses étudiants, l’Université Internationale de Rabat propose un centre médical accessible à l’ensemble des étudiants de l’UIR avec la mise à disposition d’une ambulance 24h/24 7j/7 sur le campus en cas de nécessité.
      
  L’UIR veille aussi sur la santé mentale de ses étudiants, et met à disposition une cellule d’écoute.    `,
    },
    {
      question: "Existe-t-il une bibliothèque au sein de l’université ?",
      answer: `Avec plus de 80 000 ouvrages, la bibliothèque de l’UIR propose des ouvrages dans plusieurs disciplines : Ingénierie, automobile, aérospatiale, Architecture, Sciences politiques, Droit des affaires, Ingénierie de l'Energie, Médecine, Informatique et logistique en plus de 80 000 ressources électroniques.
  
  La bibliothèque est accessible sur le campus, cependant l’UIR détient aussi une bibliothèque numérique pour un accès digital.`,
    },
    {
      question:
        "Quels types de chambres sont disponibles à la résidence universitaire de l’UIR ?",
      answer: `Chambre simple
  Chambre simple avec balcon
  Chambre simple plus
  Chambre double
  Chambre double plus`,
    },
    {
      question:
        "Quels sont les tarifs des chambresde la résidence universitaire de l’UIR ?",
      answer: `Chambre simple (RDC) : 2 800 DH/mois
  Chambre simple plus (RDC) : 3 150 DH/mois
  Chambre double (RDC) : 2 000 DH/mois
  Chambre double plus (RDC) : 2 200 DH/mois`,
    },
    {
      question:
        "Quelles sont les modalités de réservation d’une chambre à l’UIR ?",
      answer: `Pour réserver une chambre, les étapes sont les suivantes :
  
  Accéder à la plateforme de réservation : citeuir.uir.ac.ma
  Choisir le type de chambre souhaité.
  Effectuer le paiement du 1er semestre, du forfait mensuel pour les espaces communs (84 DH/mois) et du dépôt de garantie de 3 000 DH TTC dans un délai de 72 heures suivant la demande de réservation.
  Télécharger le justificatif de paiement sur la plateforme`,
    },
    {
      question:
        "Quels sont les modes de paiement acceptés pour la réservation ?",
      answer: `Les paiements peuvent être effectués via :
  Chèque à l’ordre de « Foncière UIR »
  Carte bancaire
  Virement bancaire sur le compte de la Foncière UIR auprès de la banque CIH, RIB : 230 810 4592924221014600 12
  Paiement en ligne via le Centre Monétique Interbancaire (CMI)`,
    },
    {
      question:
        "Est-il possible d’annuler une réservation et d’obtenir un remboursement ?",
      answer: `Oui, les conditions d'annulation sont les suivantes :
  Annulation avant le 31 août : remboursement intégral.
  Annulation avant le 1er octobre (sans check-in) : facturation du mois de septembre.
  Après check-in : aucune demande d’annulation n’est recevable et aucun remboursement ne sera effectué.`,
    },
    {
      question:
        "Qui peut bénéficier d’une chambre à la résidence universitaire de l’UIR ?",
      answer: `Les chambres sont attribuées en priorité aux :
  Nouveaux résidents
  Résidents souhaitant changer de chambre
  Les étudiants résidant dans la région de Rabat, Salé, Témara ne sont pas priorisés lors de la campagne de réservation. Leurs demandes sont enregistrées sur une liste d’attente traitée en fonction de la disponibilité en début d’année universitaire.`,
    },
    {
      question: "Quels services sont inclus dans le loyer ?",
      answer: `Le loyer comprend :
  Forfait énergétique : eau froide (2 m³), eau chaude (1 m³) et électricité (20 KWH)
  Accès aux espaces communs : moyennant un forfait mensuel de 84 DH TTC`,
    },
    {
      question:
        "Où puis-je obtenir plus d'informations ou poser des questions sur l'hébergement ?",
      answer: `Pour toute information complémentaire, vous pouvez :
  Envoyer un e-mail à : hebergementuir@uir.ac.ma
  Appeler au : 05 30 11 20 65/66
  Vous rendre aux locaux administratifs situés au RDC de la Résidence 6, du lundi au vendredi (8h30-19h00) et le samedi matin (8h30-13h00).`,
    },
    {
      question: "Qu'est-ce que le PASS UIR ?",
      answer: `Le PASS UIR est un service de navettes subventionné par l'Université Internationale de Rabat, destiné à faciliter les déplacements des étudiants entre le campus et les villes de Rabat, Salé et Témara.`,
    },
    {
      question: "Quelles sont les lignes desservies par le PASS UIR ?",
      answer: `Le service couvre plusieurs stations :
  Rabat : Agdal (Agence INWI), Tour Hassan, Hay Riad, Biougnach
  Salé : Gare Tabriquet, Bab El Mrissa
  Témara : Parking ACIMA, Harhoura – Le Rivage Palace`,
    },
    {
      question: "Quels sont les horaires des navettes ?",
      answer: `Les navettes fonctionnent du lundi au vendredi, avec des départs réguliers le matin, l'après-midi et le soir. Des services sont également disponibles le samedi et le dimanche, bien que les horaires puissent varier.`,
    },
    {
      question: "Quel est le tarif du PASS UIR ?",
      answer: `Les navettes fonctionnent du lundi au vendredi, avec des départs réguliers le matin, l'après-midi et le soir. Des services sont également disponibles le samedi et le dimanche, bien que les horaires puissent varier.
  Les tarifs pour l'année académique 2024/2025 sont les suivants :
  Annuel : 3 500 MAD
  Semestriel : 2 100 MAD
  Mensuel : 700 MAD`,
    },
    {
      question: "Quels documents dois-je présenter pour accéder aux navettes ?",
      answer:
        "Les étudiants doivent impérativement être munis de leur carte d'étudiant ou du reçu de paiement pour accéder aux navettes.",
    },
    {
      question:
        "Le PASS UIR est-il disponible pendant les vacances universitaires ?",
      answer:
        "Le service peut être suspendu pendant les vacances universitaires, les jours fériés et le mois d'août. ",
    },
    {
      question: "Est-ce que c’est une université privée ou publique ?",
      answer:
        "Nous sommes une université privée, néanmoins, tous nos diplômes sont équivalents aux diplômes délivrés par des institutions étatiques, aussi, nous offres des possibilités de bourses et de financement des études.",
    },
    {
      question: "Quels sont les programmes que vous proposez ?",
      answer:
        "L’université propose un catalogue riche en formations, réparties entre les trois cycles de formation et les quatre collèges :\n\nPost bac :\nCollège Ingénierie et Architecture :\n- Ingénierie informatique \n- Ingénierie de l’énergie\n- Ingénierie automobile\n- Ingénierie aérospatiale\n- Génie civil\n- Architecture\n\nCollège des sciences sociales :\n- Droit des affaires\n- Sciences politiques\n- Communication et médias\n- Psychologie\n- Economie\n\nCollège Management :\n- International program in management\n- International talents in business\n\nCollège Santé :\n- Médecine\n- Médecine dentaire\n- Biotechnologie\n- Génie biomédical\n- Infirmier polyvalent\n- Infirmier en anesthésie et réanimation\n- Technicien d’imagerie médicale\n- Technicien de laboratoire\n\nAdmission par voie de passerelle :\nAccès possible en 2e, 3e ou 4e année selon le cursus.\n\nMasters :\n- Intelligence Artificielle\n- Politiques publiques\n- Gouvernance et Institutions Internationales\n- Sécurité Internationale\n- Droit Notarial des Affaires\n- Droit des Affaires et Management des Entreprises\n- Droit des Affaires et Fiscalité\n- Juriste d'Affaires International\n- Communication des Organisations\n- المهن القانونية و القضائية\n- International Finance Comptabilité\n- Contrôle – Audit\n- Grande Ecole Programme in Management (2e année)\n- International Business\n- Human Capital & Talent Management\n- Strategic & Digital Marketing\n- Supply Chain Management & Purchasing\n- Business Analytics & Data Science\n- Agile Project Management & Innovation\n- Nutrition Humaine et Techniques Nucléaires\n- Sciences Biomédicales Appliquées",
    },
    {
      question: "Quels sont les frais de vos formations ?",
      answer:
        "Les tarifs dépendent de la formation choisie, ci-après les tarifs par formation :\n\n- Ingénierie : Post bac et Admission par voie de passerelle 76000 DH, masters 72000 DH\n- Architecture : 95000 DH\n- Sciences sociales : 72000 DH\n- Management : 75000 DH pour les Post bac et AST, 80000 DH pour les masters",
    },
    {
      question: "Quelles sont les matières que je passerai lors du concours ?",
      answer:
        "Les épreuves à passer dépendent d’un programme à l’autre et d’un niveau à l’autre.\n\n- Certaines filières ont des épreuves uniquement orales (Droit, Communication, etc.).\n- Médecine et Médecine dentaire : concours écrit.\n- Ingénierie, Architecture, Biotechnologie, etc. : concours écrit + oral.\n- Pour les admissions passerelles : étude du dossier + entretien si nécessaire.\n- Pour les masters RBS : concours écrit + oral.\n- Pour les autres masters : étude de dossier + entretien.",
    },
    {
      question: "Quelles sont les dates de concours ?",
      answer:
        "Les dates des concours sont listées par collège et filière. Par exemple :\n\nCollège Ingénierie et Architecture :\n- Ingénierie : 3 mai, 22 juin, 14 juillet, 29 août 2025\n- Architecture : 4 mai, 21 juin, 15 juillet, 28 août 2025\n\nSciences sociales :\n- 12 avril, 10 mai, 14 juin, 18 juillet, 27 août, 3 septembre\n\nManagement :\n- International talents in business : 12 avril (écrit), 19 avril (oral)\n- International program in management : 26 avril (écrit), 3 mai (oral)\n\nSanté :\n- Génie biomédical : 14 mai, 23 juin, 17 juillet, 27 août 2025\n- Biotechnologie : 7 mai, 24 juin, 24 juillet, 30 août 2025\n- Infirmier & technicien : 6 mai, 25 juin, 23 juillet, 13 septembre 2025\n\nNB : Pour Médecine et Médecine dentaire, la date sera communiquée par le ministère.",
    },
    {
      question: "Est-ce que je peux passer le concours à distance ?",
      answer:
        "Les concours se déroulent en présentiel, néanmoins si vous n’êtes pas au Maroc le moment venu, nous pouvons étudier la possibilité du concours en ligne, veuillez nous préciser la formation et le niveau qui vous intéressent.",
    },
    {
      question:
        "Est-ce que je peux avoir des exemplaires des précédentes épreuves ?",
      answer:
        "Les exemplaires des précédentes épreuves sont téléchargeables depuis votre espace candidat, sur la vue « Choix et convocations ».",
    },
    {
      question:
        "J’ai candidaté à la filière XXX pour un accès en 2ème année mais je n’ai pas eu de retour.",
      answer:
        "Prière de nous adresser votre nom complet ainsi que la filière choisie sur cette adresse mail, nous en ferons le suivi et vous reviendrons incessamment : concours@uir.ac.ma",
    },
    {
      question:
        "J’ai candidaté à la filière XXX pour un accès master mais le statut apparait en tant que « validé », mais je n’ai pas eu de retour sur ce qui va suivre.",
      answer:
        "Votre dossier a été validé sur le plan académique, nos collègues en charge de la filière choisie prendront attache avec vous incessamment pour un entretien.",
    },
    {
      question: "Est-ce que je peux bénéficier d’une bourse ?",
      answer:
        "Nos bourses sont ouvertes à tous nos candidats mais avec des conditions.\n- Les étudiants inscrits à l’un des programmes de l’UIR et disposant d’une adresse électronique UIR peuvent déposer leurs dossiers de demande de bourse en ligne via bourse.uir.ac.ma.\n- Le dossier comprend un formulaire + pièces justificatives.\n- Confirmation et suivi de la demande sont disponibles sur la plateforme.\n- La décision est envoyée par mail.\n- Si acceptée, les documents originaux doivent être déposés au bureau de bourse dans les délais.\n- Contact : bourses@uir.ac.ma ou 0530103000.",
    },
    {
      question: "Est-ce que le transport est assuré ?",
      answer:
        "Une prestation de transport couvre la région Rabat-Salé-Témara. Pour plus de détails, veuillez nous contacter sur le 0530103000.",
    },
    {
      question:
        "Est-ce que l’université propose le service d’hébergement, si oui, quels sont les tarifs ?",
      answer:
        "Une prestation hébergement est proposée aux étudiants n’habitant pas à la région Rabat. Une fois que le candidat est admis, il procède à l’inscription puis à la réservation de sa chambre. Pour plus de détails, veuillez nous contacter sur le 0530103000 ou par mail sur hebergementuir@uir.ac.ma.",
    },
  ];

  await vectorStore.addModels(
    await db.$transaction(
      faqs.map((content) =>
        db.document.create({
          data: { question: content.question, answer: content.answer },
        })
      )
    )
  );

  const resultOne = await vectorStore.similaritySearch(
    "Rabat Business School est-elle accréditée par l'AACSB ?",
    1
  );
  console.log(resultOne);

  // create an instance with default filter
  const vectorStore2 = PrismaVectorStore.withModel<Document>(db).create(
    new OpenAIEmbeddings(),
    {
      prisma: Prisma,
      tableName: "Document",
      vectorColumnName: "vector",
      columns: {
        id: PrismaVectorStore.IdColumn,
        question: PrismaVectorStore.ContentColumn,
        answer: PrismaVectorStore.ContentColumn,
      },
      filter: {
        question: {
          equals: "default",
        },
      },
    }
  );

  await vectorStore2.addModels(
    await db.$transaction(
      faqs.map((content) =>
        db.document.create({
          data: { question: content.question, answer: content.answer },
        })
      )
    )
  );

  // Use the default filter a.k.a {"content": "default"}
  const resultTwo = await vectorStore.similaritySearch(
    "Do you open on Sundays?",
    5
  );
  console.log("*********");
  console.log(resultTwo);
  console.log("*********");
};

run();
