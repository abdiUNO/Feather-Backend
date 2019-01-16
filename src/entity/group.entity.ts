import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    default: false,
  })
  isFull: boolean;

  @ManyToMany(type => User, user => user.groups, {
    cascade: ['insert'],
  })
  @JoinTable()
  users: User[];
}
//
// {
//   "data":
//   [
//     {
//       "id": "fc1ee8fa-15e1-4565-be84-2eba4ca444df",
//       "username": "amahamed",
//       "email": "amahamed@unomaha.edu",
//       "password": "f8bb18993fa0eff46f216b26e326babf58a0ea4f8a82278e7e7a9a059b75bd14",
//       "createdAt": "2019-01-08 19:32:00.796906",
//       "updatedAt": "2019-01-08 19:32:28.000000",
//       "subscription": "Gaming,Anonymous",
//       "image": "912b99ccc58aca104fa7acf2a5add9630.jpg"
//     }
//   ]
// }

// {
//   "data":
//   [
//     {
//       "username": "Amethyst ",
//       "email": "awinstryg@unomaha.edu",
//       "password": "379edeb7451452c2d151219c0c32bd2b0f94b333217c069d1c4c698936afc057",
//       "createdAt": "2019-01-07 21:50:36.684698",
//       "updatedAt": "2019-01-07 21:51:59.000000",
//       "subscription": "Music,Movies,Art,Stories,Anonymous",
//       "image": "2ba44bf55773a3b6a31012498e610136c6.JPEG"
//     },
//     {
//       "username": "arosse",
//       "email": "arosse@unomaha.edu",
//       "password": "e55775682e9459a91dd5b5949b3d66ca1e055837bf6cfa4accd07664280417bf",
//       "createdAt": "2019-01-08 04:22:18.500928",
//       "updatedAt": "2019-01-08 04:22:53.000000",
//       "subscription": "",
//       "image": "264c7d444c7c299edcddf2cbc10cdc638.JPEG"
//     },
//     {
//       "username": "Javier ",
//       "email": "jlhernandez@unomaha.edu",
//       "password": "563966674438bfa2b3980686c8c2747a753d636a92cb7a51cbf5384a672a45ff",
//       "createdAt": "2019-01-07 18:14:55.242901",
//       "updatedAt": "2019-01-07 23:09:01.000000",
//       "subscription": "Anonymous,Stories,Science and Engineering,Art,Business,Liberal,Conservative,News,Movies,Music,Sports,Fitness,Gaming",
//       "image": ""
//     },
//     {
//       "username": "North Sea",
//       "email": "sjordanchowning@unomaha.edu",
//       "password": "b895d50490a766eaa888adfe4ad335e33af4cc91a1b274dd8ec6e5dda59b70b9",
//       "createdAt": "2019-01-07 23:46:19.125030",
//       "updatedAt": "2019-01-08 03:42:58.000000",
//       "subscription": "",
//       "image": "810cefd6304eb7829652ad28a9988ea26.JPEG"
//     },
//     {
//       "username": "ttodd1031",
//       "email": "tatodd@unomaha.edu",
//       "password": "bbc801e461b5d02dabe12482e8ec53a7ee67b81242450352b88011ea07c3a5ce",
//       "createdAt": "2019-01-07 20:52:50.522113",
//       "updatedAt": "2019-01-07 20:52:50.522113",
//       "subscription": "",
//       "image": ""
//     }
//   ]
// }
