import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from 'src/libs/utility/constants/enums';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
