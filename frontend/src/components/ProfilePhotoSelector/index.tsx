import { useProfilePhotoSelector } from './use-profile-photo-selector';
import { LuTrash, LuUpload, LuUser } from 'react-icons/lu';

interface ProfilePhotoSelectorProps {
  onChange: (file: File | null) => void;
}

export const ProfilePhotoSelector = ({ onChange }: ProfilePhotoSelectorProps) => {
  const {
    inputRef,
    handleImageChange,
    previewUrl,
    handleRemove,
    onChooseFile,
  } = useProfilePhotoSelector({ onChange });
  return (
    <div className='flex justify-center mb-6'>
      <input
        type='file'
        accept='image/*'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
      />
      {!previewUrl ? (
        <div className='w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative'>
          <LuUser className='text-4xl text-primary' />
          <button
            type='button'
            className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1'
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className='relative'>
          <img
            src={previewUrl!}
            alt='Porfile Photo'
            className='w-20 h-20 rounded-full object-cover'
          />
          <button
            type='button'
            className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1'
            onClick={handleRemove}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};
