import { useRef, useState, type ChangeEvent } from 'react';

interface UseProfilePhotoSelctorReturn {
  handleImageChange: (event: any) => void;
  handleRemove: () => void;
  onChooseFile: () => void;
  previewUrl: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  image: File | null;
}

interface UseProfilePhotoSelectorProps {
  onChange: (file: File | null) => void;
}

export const useProfilePhotoSelector = ({ onChange }: UseProfilePhotoSelectorProps): UseProfilePhotoSelctorReturn => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) {
      setImage(file);
      onChange(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
    event.target.value = '';
  };

  const handleRemove = () => {
    setImage(null);
    setPreviewUrl(null);
    onChange(null);
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return {
    handleImageChange,
    handleRemove,
    onChooseFile,
    previewUrl,
    inputRef,
    image,
  };
};
